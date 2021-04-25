const Router = require('express');
const AvatarController = require('../services/avatarController');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const router = new Router();

router.post('/avatar', authorizationMiddleware, AvatarController.uploadAvatar);
router.post('/avatar/cropp', authorizationMiddleware, AvatarController.croppAvatar);
router.delete('/avatar', authorizationMiddleware, AvatarController.deleteAvatar);

module.exports = router;
