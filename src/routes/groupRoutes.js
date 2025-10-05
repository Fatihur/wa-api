const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const upload = require('../middleware/upload');

router.post('/:sessionId/create', groupController.createGroup);
router.get('/:sessionId/:jid/metadata', groupController.getGroupMetadata);
router.put('/:sessionId/name', groupController.updateGroupName);
router.put('/:sessionId/description', groupController.updateGroupDescription);
router.put('/:sessionId/picture', upload.single('image'), groupController.updateGroupPicture);
router.post('/:sessionId/participants/add', groupController.addParticipants);
router.post('/:sessionId/participants/remove', groupController.removeParticipants);
router.post('/:sessionId/participants/promote', groupController.promoteParticipants);
router.post('/:sessionId/participants/demote', groupController.demoteParticipants);
router.post('/:sessionId/leave', groupController.leaveGroup);
router.get('/:sessionId/:jid/invite-code', groupController.getInviteCode);
router.post('/:sessionId/invite-code/revoke', groupController.revokeInviteCode);
router.post('/:sessionId/join', groupController.joinGroupViaInvite);
router.put('/:sessionId/settings', groupController.toggleGroupSettings);
router.get('/:sessionId/invite/:inviteCode', groupController.getGroupInviteInfo);

module.exports = router;
