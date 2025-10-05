const sessionManager = require('../services/sessionManager');
const { success, error } = require('../utils/response');

const getProfile = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.query;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const status = await sock.fetchStatus(jid);
    let profilePicUrl = null;
    
    try {
      profilePicUrl = await sock.profilePictureUrl(jid, 'image');
    } catch (err) {
      profilePicUrl = null;
    }

    return success(res, {
      jid,
      status: status?.status,
      statusTimestamp: status?.setAt,
      profilePicture: profilePicUrl
    }, 'Profile retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateProfileName = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.updateProfileName(name);
    return success(res, null, 'Profile name updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateProfileStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.updateProfileStatus(status);
    return success(res, null, 'Profile status updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { imageUrl } = req.body;
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

    await sock.updateProfilePicture(sock.user.id, imageBuffer);
    return success(res, null, 'Profile picture updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const removeProfilePicture = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.removeProfilePicture(sock.user.id);
    return success(res, null, 'Profile picture removed');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const blockContact = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.updateBlockStatus(jid, 'block');
    return success(res, null, 'Contact blocked');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const unblockContact = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { jid } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.updateBlockStatus(jid, 'unblock');
    return success(res, null, 'Contact unblocked');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getBlockedContacts = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const blocked = await sock.fetchBlocklist();
    return success(res, { blocked }, 'Blocked contacts retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getContacts = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const contacts = await sock.store?.contacts || {};
    return success(res, { contacts }, 'Contacts retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getChats = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const chats = await sock.store?.chats || {};
    return success(res, { chats }, 'Chats retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const checkNumberStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { numbers } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const results = await Promise.all(
      numbers.map(async (number) => {
        try {
          const [result] = await sock.onWhatsApp(number);
          return {
            number,
            exists: !!result,
            jid: result?.jid
          };
        } catch (err) {
          return {
            number,
            exists: false,
            error: err.message
          };
        }
      })
    );

    return success(res, { results }, 'Number status checked');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updatePrivacySettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { setting, value } = req.body;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    await sock.updatePrivacySettings({ [setting]: value });
    return success(res, null, 'Privacy settings updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getPrivacySettings = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sock = sessionManager.getSocket(sessionId);
    if (!sock) {
      return error(res, 'Session not found', 404);
    }

    const settings = await sock.fetchPrivacySettings();
    return success(res, settings, 'Privacy settings retrieved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  getProfile,
  updateProfileName,
  updateProfileStatus,
  updateProfilePicture,
  removeProfilePicture,
  blockContact,
  unblockContact,
  getBlockedContacts,
  getContacts,
  getChats,
  checkNumberStatus,
  updatePrivacySettings,
  getPrivacySettings
};
