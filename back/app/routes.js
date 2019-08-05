const express = require('express');
const authController = require('./controllers/auth/auth.controller')
const bankController = require('./controllers/bank/bank.controller')
const authService = require('./services/auth/auth.service');

const router = express.Router();

router.post('/auth/signin', authController.singin);
router.post('/auth/signup', authController.signup);

router.get('/bank', authService.isAuthenticated, bankController.getOwnedPokemons);

module.exports = router;
