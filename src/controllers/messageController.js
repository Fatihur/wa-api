const sessionManager = require('../services/sessionManager');
const { success, error } = require('../utils/response');
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const sendText = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, text } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.sendMessage(jid, { text });
    return success(res, result, 'Message sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendImage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, caption, imageUrl } = req.body;
    const image = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let imageBuffer;
    if (image) {
      imageBuffer = fs.readFileSync(image.path);
      fs.unlinkSync(image.path);
    } else if (imageUrl) {
      const response = await require('axios').get(imageUrl, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data);
    } else {
      return error(res, 'Image file or imageUrl is required', 400);
    }

    const result = await sock.sendMessage(jid, {
      image: imageBuffer,
      caption: caption || ''
    });

    return success(res, result, 'Image sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendVideo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, caption, videoUrl } = req.body;
    const video = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let videoBuffer;
    if (video) {
      videoBuffer = fs.readFileSync(video.path);
      fs.unlinkSync(video.path);
    } else if (videoUrl) {
      const response = await require('axios').get(videoUrl, { responseType: 'arraybuffer' });
      videoBuffer = Buffer.from(response.data);
    } else {
      return error(res, 'Video file or videoUrl is required', 400);
    }

    const result = await sock.sendMessage(jid, {
      video: videoBuffer,
      caption: caption || ''
    });

    return success(res, result, 'Video sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendAudio = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, audioUrl, ptt } = req.body;
    const audio = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let audioBuffer;
    if (audio) {
      audioBuffer = fs.readFileSync(audio.path);
      fs.unlinkSync(audio.path);
    } else if (audioUrl) {
      const response = await require('axios').get(audioUrl, { responseType: 'arraybuffer' });
      audioBuffer = Buffer.from(response.data);
    } else {
      return error(res, 'Audio file or audioUrl is required', 400);
    }

    const result = await sock.sendMessage(jid, {
      audio: audioBuffer,
      ptt: ptt === 'true' || ptt === true
    });

    return success(res, result, 'Audio sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendDocument = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, fileName, documentUrl } = req.body;
    const document = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let documentBuffer;
    let docFileName = fileName;

    if (document) {
      documentBuffer = fs.readFileSync(document.path);
      docFileName = docFileName || document.originalname;
      fs.unlinkSync(document.path);
    } else if (documentUrl) {
      const response = await require('axios').get(documentUrl, { responseType: 'arraybuffer' });
      documentBuffer = Buffer.from(response.data);
      docFileName = docFileName || path.basename(documentUrl);
    } else {
      return error(res, 'Document file or documentUrl is required', 400);
    }

    const result = await sock.sendMessage(jid, {
      document: documentBuffer,
      fileName: docFileName,
      mimetype: 'application/octet-stream'
    });

    return success(res, result, 'Document sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendSticker = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, stickerUrl } = req.body;
    const sticker = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let stickerBuffer;
    if (sticker) {
      stickerBuffer = fs.readFileSync(sticker.path);
      fs.unlinkSync(sticker.path);
    } else if (stickerUrl) {
      const response = await require('axios').get(stickerUrl, { responseType: 'arraybuffer' });
      stickerBuffer = Buffer.from(response.data);
    } else {
      return error(res, 'Sticker file or stickerUrl is required', 400);
    }

    const result = await sock.sendMessage(jid, {
      sticker: stickerBuffer
    });

    return success(res, result, 'Sticker sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendLocation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, latitude, longitude, name, address } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.sendMessage(jid, {
      location: {
        degreesLatitude: parseFloat(latitude),
        degreesLongitude: parseFloat(longitude),
        name: name || '',
        address: address || ''
      }
    });

    return success(res, result, 'Location sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendContact = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, contacts } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const vcard = contacts.map(contact => 
      `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.fullName}\nTEL;type=CELL;type=VOICE;waid=${contact.waid}:+${contact.phoneNumber}\nEND:VCARD`
    ).join('\n');

    const result = await sock.sendMessage(jid, {
      contacts: {
        displayName: contacts[0].fullName,
        contacts: contacts.map(c => ({ vcard }))
      }
    });

    return success(res, result, 'Contact sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendReaction = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, messageId, emoji } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.sendMessage(jid, {
      react: {
        text: emoji,
        key: { id: messageId, remoteJid: jid }
      }
    });

    return success(res, result, 'Reaction sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendButtons = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, text, buttons, footer } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const buttonMessage = {
      text,
      footer: footer || '',
      buttons: buttons.map((btn, idx) => ({
        buttonId: btn.id || `btn_${idx}`,
        buttonText: { displayText: btn.text },
        type: 1
      })),
      headerType: 1
    };

    const result = await sock.sendMessage(jid, buttonMessage);
    return success(res, result, 'Button message sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendList = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, text, buttonText, sections, footer } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const listMessage = {
      text,
      footer: footer || '',
      title: text,
      buttonText: buttonText || 'Menu',
      sections
    };

    const result = await sock.sendMessage(jid, listMessage);
    return success(res, result, 'List message sent');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const forwardMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, messageId, fromJid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.sendMessage(jid, {
      forward: {
        key: { id: messageId, remoteJid: fromJid }
      }
    });

    return success(res, result, 'Message forwarded');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, messageId } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.sendMessage(jid, {
      delete: {
        id: messageId,
        remoteJid: jid
      }
    });

    return success(res, result, 'Message deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, messageId } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.readMessages([{ remoteJid: jid, id: messageId }]);
    return success(res, null, 'Message marked as read');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const sendPresenceUpdate = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, type } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.sendPresenceUpdate(type, jid);
    return success(res, null, 'Presence updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const downloadMedia = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { messageId, jid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const msg = await sock.loadMessage(jid, messageId);
    const buffer = await downloadMediaMessage(msg, 'buffer', {});

    return success(res, { media: buffer.toString('base64') }, 'Media downloaded');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  sendText,
  sendImage,
  sendVideo,
  sendAudio,
  sendDocument,
  sendSticker,
  sendLocation,
  sendContact,
  sendReaction,
  sendButtons,
  sendList,
  forwardMessage,
  deleteMessage,
  markAsRead,
  sendPresenceUpdate,
  downloadMedia
};
