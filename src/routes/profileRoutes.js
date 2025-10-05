const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload');

router.get('/:sessionId/profile', profileController.getProfile);
router.put('/:sessionId/profile/name', profileController.updateProfileName);
router.put('/:sessionId/profile/status', profileController.updateProfileStatus);
router.put('/:sessionId/profile/picture', upload.single('image'), profileController.updateProfilePicture);
router.delete('/:sessionId/profile/picture', profileController.removeProfilePicture);
router.post('/:sessionId/contacts/block', profileController.blockContact);
router.post('/:sessionId/contacts/unblock', profileController.unblockContact);
router.get('/:sessionId/contacts/blocked', profileController.getBlockedContacts);
router.get('/:sessionId/contacts', profileController.getContacts);
router.get('/:sessionId/chats', profileController.getChats);
router.post('/:sessionId/check-number', profileController.checkNumberStatus);
router.put('/:sessionId/privacy', profileController.updatePrivacySettings);
router.get('/:sessionId/privacy', profileController.getPrivacySettings);

module.exports = router;
