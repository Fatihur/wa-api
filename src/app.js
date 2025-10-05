require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const sessionRoutes = require('./routes/sessionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp API Gateway',
    version: '1.0.0',
    documentation: '/docs',
    api_documentation: '/api/docs'
  });
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs.html'));
});

app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      session: {
        'POST /api/session/create': 'Create new WhatsApp session',
        'GET /api/session': 'Get all sessions',
        'GET /api/session/:sessionId/qr': 'Get QR code for session',
        'GET /api/session/:sessionId/status': 'Get session status',
        'DELETE /api/session/:sessionId': 'Delete session'
      },
      message: {
        'POST /api/message/:sessionId/send/text': 'Send text message',
        'POST /api/message/:sessionId/send/image': 'Send image (multipart/form-data)',
        'POST /api/message/:sessionId/send/video': 'Send video (multipart/form-data)',
        'POST /api/message/:sessionId/send/audio': 'Send audio (multipart/form-data)',
        'POST /api/message/:sessionId/send/document': 'Send document (multipart/form-data)',
        'POST /api/message/:sessionId/send/sticker': 'Send sticker (multipart/form-data)',
        'POST /api/message/:sessionId/send/location': 'Send location',
        'POST /api/message/:sessionId/send/contact': 'Send contact',
        'POST /api/message/:sessionId/send/reaction': 'Send reaction to message',
        'POST /api/message/:sessionId/send/buttons': 'Send button message',
        'POST /api/message/:sessionId/send/list': 'Send list message',
        'POST /api/message/:sessionId/forward': 'Forward message',
        'POST /api/message/:sessionId/delete': 'Delete message',
        'POST /api/message/:sessionId/read': 'Mark message as read',
        'POST /api/message/:sessionId/presence': 'Send presence update (typing, recording, online)',
        'POST /api/message/:sessionId/download': 'Download media from message'
      },
      group: {
        'POST /api/group/:sessionId/create': 'Create new group',
        'GET /api/group/:sessionId/:jid/metadata': 'Get group metadata',
        'PUT /api/group/:sessionId/name': 'Update group name',
        'PUT /api/group/:sessionId/description': 'Update group description',
        'PUT /api/group/:sessionId/picture': 'Update group picture',
        'POST /api/group/:sessionId/participants/add': 'Add participants to group',
        'POST /api/group/:sessionId/participants/remove': 'Remove participants from group',
        'POST /api/group/:sessionId/participants/promote': 'Promote participants to admin',
        'POST /api/group/:sessionId/participants/demote': 'Demote admin to participant',
        'POST /api/group/:sessionId/leave': 'Leave group',
        'GET /api/group/:sessionId/:jid/invite-code': 'Get group invite code',
        'POST /api/group/:sessionId/invite-code/revoke': 'Revoke and generate new invite code',
        'POST /api/group/:sessionId/join': 'Join group via invite code',
        'PUT /api/group/:sessionId/settings': 'Update group settings (locked/unlocked)',
        'GET /api/group/:sessionId/invite/:inviteCode': 'Get group info from invite code'
      },
      profile: {
        'GET /api/profile/:sessionId/profile': 'Get profile information',
        'PUT /api/profile/:sessionId/profile/name': 'Update profile name',
        'PUT /api/profile/:sessionId/profile/status': 'Update profile status',
        'PUT /api/profile/:sessionId/profile/picture': 'Update profile picture',
        'DELETE /api/profile/:sessionId/profile/picture': 'Remove profile picture',
        'POST /api/profile/:sessionId/contacts/block': 'Block contact',
        'POST /api/profile/:sessionId/contacts/unblock': 'Unblock contact',
        'GET /api/profile/:sessionId/contacts/blocked': 'Get blocked contacts',
        'GET /api/profile/:sessionId/contacts': 'Get all contacts',
        'GET /api/profile/:sessionId/chats': 'Get all chats',
        'POST /api/profile/:sessionId/check-number': 'Check if numbers are on WhatsApp',
        'PUT /api/profile/:sessionId/privacy': 'Update privacy settings',
        'GET /api/profile/:sessionId/privacy': 'Get privacy settings'
      }
    },
    note: 'All endpoints are publicly accessible'
  });
});

app.use('/api/session', sessionRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/profile', profileRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, HOST, () => {
  logger.info(`WhatsApp API Gateway running on http://${HOST}:${PORT}`);
  logger.info(`API Documentation: http://${HOST}:${PORT}/api/docs`);
});

module.exports = app;
