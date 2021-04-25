const Router = require('express');
const userController = require('../services/userController');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const router = new Router();

router.put('/password', authorizationMiddleware, userController.changePassword);
router.put('/name', authorizationMiddleware, userController.changeName);

module.exports = router;
