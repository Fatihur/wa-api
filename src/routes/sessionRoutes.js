const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/create', sessionController.createSession);
router.get('/', sessionController.getAllSessions);
router.get('/:sessionId/qr', sessionController.getQR);
router.get('/:sessionId/status', sessionController.getStatus);
router.delete('/:sessionId', sessionController.deleteSession);

module.exports = router;
