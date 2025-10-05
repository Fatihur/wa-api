const sessionManager = require('../services/sessionManager');
const { success, error } = require('../utils/response');

const createSession = async (req, res) => {
  try {
    const { sessionId, webhookUrl } = req.body;

    if (!sessionId) {
      return error(res, 'sessionId is required', 400);
    }

    await sessionManager.createSession(sessionId, webhookUrl);

    return success(res, { sessionId }, 'Session created. Scan QR code to connect', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getQR = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const qr = sessionManager.getQR(sessionId);

    if (!qr) {
      return error(res, 'QR code not available. Session might be connected or not started', 404);
    }

    return success(res, { qr }, 'QR code retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return error(res, 'Session not found', 404);
    }

    return success(res, {
      sessionId,
      status: session.status,
      user: session.socket.user
    }, 'Session status retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await sessionManager.deleteSession(sessionId);

    return success(res, null, 'Session deleted successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getAllSessions = async (req, res) => {
  try {
    const sessions = sessionManager.getAllSessions();
    return success(res, { sessions }, 'All sessions retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  createSession,
  getQR,
  getStatus,
  deleteSession,
  getAllSessions
};
