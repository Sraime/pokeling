const I = actor();
const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const OwnedPokemonModel = require('../models/owned-pokemon');
const config = require('../../config');

Before(async() => {
  if(mongoose.connection.readyState === 0) {
    var mongoDB = 'mongodb://'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.db;
    mongoose.connect(mongoDB, { useNewUrlParser: true })
        .then(()=> {})
        .catch((e)=> console.error("DB error !", e));
  }
  await cleanUpDb();
});

const cleanUpDb = async() => {
  await UserModel.deleteMany({});
  await OwnedPokemonModel.deleteMany({});
}

After(async() => {
  await cleanUpDb();
  mongoose.connection.close()
        .then(()=> {})
        .catch((e)=> console.error("DB closing error !", e));
});

Fail(async(test, err) => {
  if(mongoose.connection.readyState !== 0) {
    await cleanUpDb();
    mongoose.connection.close()
          .then(()=> {})
          .catch((e)=> console.error("DB closing error !", e));
  }
});

Given('l\'utilisateur {string} avec l\'email {string} et le mdp {string} est enregistré', async (pseudo, email, mdp) => {
  await I.sendPostRequest(config.back.url+'/auth/signup', {pseudo: pseudo, email: email, password: mdp});
});

When('je suis sur l\'écran de connexion', () => {
  I.amOnPage(config.front.url+'/auth/login');
});

When('je saisis l\'email {string}', (email) => {
  I.fillField('email', email);
});

When('je saisis le mdp {string}', (mdp) => {
  I.fillField('password', mdp);
});

When('je valide la connexion', () => {
  I.click('connexion', "#login-form");
});

Then('je suis connecté en tant que {string}', (pseudo) => {
  I.seeTextEquals(pseudo, '#pseudo-user-connected');
});

Then('je suis sur ma banque', () => {
  I.seeCurrentUrlEquals(config.front.url+'/bank');
});

Then('le message d\'erreur {string} s\'affiche dans le cadre de connexion', (msg) => {
  I.see(msg, {css: '.card-login'});
});

Given('je suis déconnecté', () => {
  I.dontSeeElement('#pseudo-user-connected');
});

When('je me rend sur l\'écran d\'accueil', () => {
  I.amOnPage(config.front.url);
});

Then('je suis redirigé sur l\'écran de connexion', () => {
  I.amOnPage(config.front.url+'/auth/login');
});

Given('je suis sur l\'écran d\'inscription', () => {
  I.amOnPage(config.front.url+'/auth/register');
});

When('je clique sur le l\'option de connexion du bandeau de navigation', () => {
  I.click("Connexion","#navbar");
});

Given('je suis connecté avec l\'email {string} avec le mdp {string}', async(email, mdp) => {
  I.amOnPage(config.front.url+'/auth/login');
  I.fillField('email', email);
  I.fillField('password', mdp);
  I.click('connexion', "#login-form");
});

When('je clique sur la option de déconnexion du bandeau de navigation', () => {
  I.click("Déconnexion","#navbar");
});

When('je clique sur l\'option d\'incription du bandeau de navigation', () => {
  I.click("Inscription","#navbar");
});

When('je saisis le champ {string} avec {string}', (name, value) => {
  I.fillField(name, value);
});

When('je valide la création du compte', () => {
  I.click('Valider', "#register-form");
});

Given('je suis redirigé sur l\'écran d\'inscription', () => {
  I.amOnPage(config.front.url+'/auth/register');
});

Then('le message {string} est affiché', (msg) => {
  I.see(msg);
});

Given('l\'utilisateur {string} possède le pokemon {string}', async(userPseudo, pokeName) => {
  let npoke = new OwnedPokemonModel({userPseudo: userPseudo, name_fr: pokeName});
  await npoke.save()
});

When('je suis sur l\'écran de la ma banque', () => {
  I.amOnPage(config.front.url+'/bank');
});

Then('la liste de mes pokemons est affichée', () => {
  I.seeElement('#bank-table');
});

Then('la liste de mes pokemons contient l\'espèce {string}', (espece) => {
  I.see(espece, {css: '#bank-table'});
});
