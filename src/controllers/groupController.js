const sessionManager = require('../services/sessionManager');
const { success, error } = require('../utils/response');

const createGroup = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name, participants } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupCreate(name, participants);
    return success(res, result, 'Group created');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getGroupMetadata = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const metadata = await sock.groupMetadata(jid);
    return success(res, metadata, 'Group metadata retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateGroupName = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, name } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.groupUpdateSubject(jid, name);
    return success(res, null, 'Group name updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateGroupDescription = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, description } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.groupUpdateDescription(jid, description);
    return success(res, null, 'Group description updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateGroupPicture = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, imageUrl } = req.body;
    const image = req.file;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    let imageBuffer;
    if (image) {
      imageBuffer = require('fs').readFileSync(image.path);
      require('fs').unlinkSync(image.path);
    } else if (imageUrl) {
      const response = await require('axios').get(imageUrl, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data);
    } else {
      return error(res, 'Image file or imageUrl is required', 400);
    }

    await sock.updateProfilePicture(jid, imageBuffer);
    return success(res, null, 'Group picture updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const addParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, participants } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupParticipantsUpdate(jid, participants, 'add');
    return success(res, result, 'Participants added');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const removeParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, participants } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupParticipantsUpdate(jid, participants, 'remove');
    return success(res, result, 'Participants removed');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const promoteParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, participants } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupParticipantsUpdate(jid, participants, 'promote');
    return success(res, result, 'Participants promoted to admin');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const demoteParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, participants } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupParticipantsUpdate(jid, participants, 'demote');
    return success(res, result, 'Participants demoted from admin');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.groupLeave(jid);
    return success(res, null, 'Left group successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getInviteCode = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const code = await sock.groupInviteCode(jid);
    return success(res, { inviteCode: code, inviteUrl: `https://chat.whatsapp.com/${code}` }, 'Invite code retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const revokeInviteCode = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const code = await sock.groupRevokeInvite(jid);
    return success(res, { inviteCode: code }, 'Invite code revoked and new code generated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const joinGroupViaInvite = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { inviteCode } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const result = await sock.groupAcceptInvite(inviteCode);
    return success(res, result, 'Joined group successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const toggleGroupSettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid, setting } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.groupSettingUpdate(jid, setting);
    return success(res, null, 'Group settings updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getGroupInviteInfo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { inviteCode } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const info = await sock.groupGetInviteInfo(inviteCode);
    return success(res, info, 'Group invite info retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  createGroup,
  getGroupMetadata,
  updateGroupName,
  updateGroupDescription,
  updateGroupPicture,
  addParticipants,
  removeParticipants,
  promoteParticipants,
  demoteParticipants,
  leaveGroup,
  getInviteCode,
  revokeInviteCode,
  joinGroupViaInvite,
  toggleGroupSettings,
  getGroupInviteInfo
};
