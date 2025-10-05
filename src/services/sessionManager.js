const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  delay
} = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.qrCodes = new Map();
    this.retries = new Map();
    this.sessionPath = process.env.SESSION_STORAGE_PATH || './sessions';
    
    if (!fs.existsSync(this.sessionPath)) {
      fs.mkdirSync(this.sessionPath, { recursive: true });
    }
  }

  async createSession(sessionId, webhookUrl = null) {
    // Cek jika session sudah ada dan masih aktif
    if (this.sessions.has(sessionId)) {
      const existingSession = this.sessions.get(sessionId);
      if (existingSession.status === 'connected' || existingSession.status === 'connecting') {
        throw new Error('Session already exists and is active');
      }
      // Jika session exists tapi disconnected, hapus dulu
      logger.info({ sessionId }, 'Cleaning up old disconnected session');
      this.sessions.delete(sessionId);
      this.qrCodes.delete(sessionId);
    }

    const sessionFolder = path.join(this.sessionPath, sessionId);
    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: logger.child({ sessionId }),
      printQRInTerminal: false,
      auth: state,
      browser: ['WA API Gateway', 'Chrome', '1.0.0'],
      qrTimeout: 60000, // 60 seconds timeout for QR
      getMessage: async (key) => {
        return { conversation: 'Hi' };
      }
    });

    this.sessions.set(sessionId, {
      socket: sock,
      webhookUrl,
      status: 'connecting',
      qr: null
    });

    this.setupEventHandlers(sessionId, sock, saveCreds, webhookUrl);

    return sock;
  }

  setupEventHandlers(sessionId, sock, saveCreds, webhookUrl) {
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      const session = this.sessions.get(sessionId);

      if (qr) {
        const qrImage = await qrcode.toDataURL(qr);
        session.qr = qrImage;
        session.status = 'qr';
        this.qrCodes.set(sessionId, qrImage);
        logger.info({ sessionId }, 'QR Code generated');

        if (webhookUrl) {
          this.sendWebhook(webhookUrl, {
            event: 'qr',
            sessionId,
            data: { qr: qrImage }
          });
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        const retryCount = this.retries.get(sessionId) || 0;
        const errorMessage = lastDisconnect?.error?.message || 'Unknown error';

        logger.info({ sessionId, statusCode, errorMessage }, 'Connection closed');
        session.status = 'disconnected';

        if (webhookUrl) {
          this.sendWebhook(webhookUrl, {
            event: 'disconnected',
            sessionId,
            data: { 
              reason: errorMessage,
              statusCode
            }
          });
        }

        // Jangan reconnect jika:
        // 1. Logged out
        // 2. QR timeout (restart from beginning)
        // 3. Sudah retry 5 kali
        const isQRTimeout = errorMessage.includes('QR refs attempts ended');
        
        if (isQRTimeout) {
          logger.warn({ sessionId }, 'QR code timeout - cleaning up session');
          this.sessions.delete(sessionId);
          this.qrCodes.delete(sessionId);
          this.retries.delete(sessionId);
        } else if (shouldReconnect && retryCount < 5) {
          logger.info({ sessionId }, `Reconnecting... Attempt ${retryCount + 1}`);
          this.retries.set(sessionId, retryCount + 1);
          
          // Hapus session lama sebelum reconnect
          this.sessions.delete(sessionId);
          this.qrCodes.delete(sessionId);
          
          setTimeout(() => {
            this.createSession(sessionId, webhookUrl).catch(err => {
              logger.error({ sessionId, error: err.message }, 'Failed to reconnect');
              this.sessions.delete(sessionId);
              this.retries.delete(sessionId);
            });
          }, 3000);
        } else {
          logger.info({ sessionId }, 'Connection permanently closed');
          this.sessions.delete(sessionId);
          this.qrCodes.delete(sessionId);
          this.retries.delete(sessionId);
        }
      }

      if (connection === 'open') {
        logger.info({ sessionId }, 'Connection opened');
        session.status = 'connected';
        session.qr = null;
        this.qrCodes.delete(sessionId);
        this.retries.delete(sessionId);

        if (webhookUrl) {
          this.sendWebhook(webhookUrl, {
            event: 'connected',
            sessionId,
            data: { user: sock.user }
          });
        }
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      const session = this.sessions.get(sessionId);
      
      if (webhookUrl && type === 'notify') {
        for (const msg of messages) {
          this.sendWebhook(webhookUrl, {
            event: 'message',
            sessionId,
            data: msg
          });
        }
      }
    });

    sock.ev.on('messages.update', (updates) => {
      if (webhookUrl) {
        this.sendWebhook(webhookUrl, {
          event: 'message.update',
          sessionId,
          data: updates
        });
      }
    });

    sock.ev.on('presence.update', (presence) => {
      if (webhookUrl) {
        this.sendWebhook(webhookUrl, {
          event: 'presence',
          sessionId,
          data: presence
        });
      }
    });

    sock.ev.on('chats.update', (chats) => {
      if (webhookUrl) {
        this.sendWebhook(webhookUrl, {
          event: 'chats.update',
          sessionId,
          data: chats
        });
      }
    });

    sock.ev.on('groups.update', (groups) => {
      if (webhookUrl) {
        this.sendWebhook(webhookUrl, {
          event: 'groups.update',
          sessionId,
          data: groups
        });
      }
    });
  }

  async sendWebhook(url, data) {
    try {
      await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      logger.debug({ url, event: data.event }, 'Webhook delivered successfully');
    } catch (error) {
      logger.warn({ error: error.message, url, event: data.event }, 'Webhook delivery failed');
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getSocket(sessionId) {
    const session = this.sessions.get(sessionId);
    return session?.socket;
  }

  async deleteSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.socket.logout();
      this.sessions.delete(sessionId);
      this.qrCodes.delete(sessionId);
      this.retries.delete(sessionId);

      const sessionFolder = path.join(this.sessionPath, sessionId);
      if (fs.existsSync(sessionFolder)) {
        fs.rmSync(sessionFolder, { recursive: true, force: true });
      }
    }
  }

  getAllSessions() {
    const sessions = [];
    for (const [id, session] of this.sessions.entries()) {
      sessions.push({
        sessionId: id,
        status: session.status,
        user: session.socket.user
      });
    }
    return sessions;
  }

  getQR(sessionId) {
    return this.qrCodes.get(sessionId);
  }
}

module.exports = new SessionManager();
