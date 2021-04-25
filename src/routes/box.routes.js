const Router = require('express');
const boxController = require('../services/boxController');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const router = new Router();

router.post('/create', authorizationMiddleware, boxController.createBox);
router.post('/:link/set-pairs', authorizationMiddleware, boxController.setPairs);
router.get('/boxes', authorizationMiddleware, boxController.getBoxes);
router.get('/:link', authorizationMiddleware, boxController.getBox);
router.put('/:link/add-user', authorizationMiddleware, boxController.addUser);
router.put('/:link/update', authorizationMiddleware, boxController.updateBoxSettings);
router.put('/:link/update-user', authorizationMiddleware, boxController.updateBoxUser);
router.delete('/:link/delete-user', authorizationMiddleware, boxController.deleteUser);
router.delete('/:link/delete-box', authorizationMiddleware, boxController.deleteBox);

module.exports = router;
