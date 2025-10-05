const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const upload = require('../middleware/upload');

router.post('/:sessionId/send/text', messageController.sendText);
router.post('/:sessionId/send/image', upload.single('image'), messageController.sendImage);
router.post('/:sessionId/send/video', upload.single('video'), messageController.sendVideo);
router.post('/:sessionId/send/audio', upload.single('audio'), messageController.sendAudio);
router.post('/:sessionId/send/document', upload.single('document'), messageController.sendDocument);
router.post('/:sessionId/send/sticker', upload.single('sticker'), messageController.sendSticker);
router.post('/:sessionId/send/location', messageController.sendLocation);
router.post('/:sessionId/send/contact', messageController.sendContact);
router.post('/:sessionId/send/reaction', messageController.sendReaction);
router.post('/:sessionId/send/buttons', messageController.sendButtons);
router.post('/:sessionId/send/list', messageController.sendList);
router.post('/:sessionId/forward', messageController.forwardMessage);
router.post('/:sessionId/delete', messageController.deleteMessage);
router.post('/:sessionId/read', messageController.markAsRead);
router.post('/:sessionId/presence', messageController.sendPresenceUpdate);
router.post('/:sessionId/download', messageController.downloadMedia);

module.exports = router;
