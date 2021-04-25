const Router = require('express');
const authController = require('../services/authController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const registrationMiddleware = require('../middleware/registrationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const router = new Router();

router.post('/registration', registrationMiddleware, (req, res, next) => authController.registration(req.body)
  .then((data) => res.send(data))
  .catch(next));

router.post('/login', authenticationMiddleware, (req, res, next) => authController.login(req.user)
  .then((data) => res.send(data))
  .catch(next));

router.get('/auth', authorizationMiddleware, (req, res, next) => authController.auth(req)
  .then((data) => res.send(data))
  .catch(next));

module.exports = router;
