const express = require('express');
const authController = require('./controllers/auth/auth.controller')
const bankController = require('./controllers/bank/bank.controller')
const authService = require('./services/auth/auth.service');
const pokemonController = require('./controllers/pokemon/pokemon.controller');
const tagController = require('./controllers/tag/tag.controller');

const router = express.Router();

router.post('/auth/signin', authController.singin);
router.post('/auth/signup', authController.signup);

router.get('/bank', authService.isAuthenticated, bankController.getOwnedPokemons);
router.get('/bank/:pseudo', bankController.getUserOwnedPokemons);
router.post('/bank', authService.isAuthenticated, bankController.addOwnedPokemon);
router.delete('/bank/:id', authService.isAuthenticated, bankController.deleteOwnedPokemon);

router.get('/pokemon', pokemonController.getPokemons);

router.get('/tag', tagController.getTags);

module.exports = router;
