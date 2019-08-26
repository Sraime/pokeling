const I = actor();
const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const OwnedPokemonModel = require('../models/owned-pokemon');
const PokemonModel = require('../models/pokemon');
const TagModel = require('../models/tag');
const config = require('../../config');
var assert = require('assert');

Before(async() => {
  var mongoDB = 'mongodb://'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.db;
  if(mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoDB, { useNewUrlParser: true })
  }
});

const cleanUpDb = async() => {
  await UserModel.deleteMany({});
  await OwnedPokemonModel.deleteMany({});
  await PokemonModel.deleteMany({});
  await TagModel.deleteMany({});
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

Then('je suis redirigé sur ma banque', () => {
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

When('je me rend sur l\'écran de ma banque', () => {
  I.amOnPage(config.front.url+'/bank');
});

When('je suis sur l\'écran de ma banque', () => {
  I.amOnPage(config.front.url+'/bank');
});

Then('la liste de mes pokemons est affichée', () => {
  I.seeElement('#bank-table');
});

Then('la liste de mes pokemons contient l\'espèce {string}', (espece) => {
  I.see(espece, {css: '#bank-table'});
});

Then('la colonne {string} est en position {string} de la banque', (columnName, position) => {
  I.see(columnName, '#bank-table th:nth-child('+position+')');
});

Given('le pokemon {string} de {string} à le tag {string} de type {string}', async(pokeName, userPseudo, tagName, tagType) => {
  const nt = {name_fr: tagName, type: tagType};
  await OwnedPokemonModel.updateMany({userPseudo: userPseudo, name_fr: pokeName}, { $push: {tags: nt}})
})

Then('le pokemon en position {string} affiche {string} pour la colone du type {string}', (position, tagName, tagType) => {
  I.see(tagName, '#bank-table tbody tr:nth-child('+position+') td.col-type-'+tagType);
})

Then('je survole le texte de la colone du type {string} pour le pokemon en position {string}', (tagType, position) => {
  I.moveCursorTo('#bank-table tbody tr:nth-child('+position+') td.col-type-'+tagType+' .tag-value');
})

Then('un message affiche {string}', (msg) => {
  I.see(msg)
})
Given('le pokemon {string} existe', async(name) => {
  const np = new PokemonModel({name_fr: name});
  await np.save();
});

When('je renseigne {string} dans le champ {string}', (value, field) => {
  I.fillField(field, value);
});

Then('l\'autocompletion me propose {string}', (suggestion) => {
  I.wait(1);
  I.see(suggestion,'.mat-autocomplete-panel')
});

When('la valeur du champ {string} est {string}', (field, value) => {
  I.seeInField(field, value);
});

Given('le tag {string} du type {string} existe', async(name, type) => {
  const nt = new TagModel({name_fr: name, type: type});
  await nt.save();
});

When('je selectionne la valeur d\'autocompletion {string} pour le champ {string}', (value, field) => {
  I.fillField(field, value);
  I.wait(1);
  I.click(value, '.mat-autocomplete-panel')
});

When('Je valide l\'ajout du pokemon dans ma banque', () => {
  I.click('#bank-add-submit')
});

Given('l\'utilisateur {string} possède le pokemon {string} avec l\'identifiant {string}', async(userPseudo, pokeName, idPoke) => {
  let npoke = new OwnedPokemonModel({_id: idPoke, userPseudo: userPseudo, name_fr: pokeName});
  await npoke.save()
});

When('je clique sur la ligne du pokemon avec l\'identifiant {string}', (idPoke) => {
  I.click("#owned-poke-"+idPoke+" td:first-child");
});

Then('le détail s\'affiche', () => {
  I.seeElement('app-bank-detail');
})

Then('le détail du pokemon affiche {string} en titre', (title) => {
  I.see(title, '.dialog-header');
});

Then('le détail contient {int} tags', (nb) => {
  I.seeNumberOfElements('.mat-dialog-content mat-chip', nb);
});

Then('la section du détail identifiée par {string} à le titre {string}', (identifier, title) => {
  I.see(title, '#bank-detail-'+identifier+' .section-title');
});

Then('la section du détail identifiée par {string} contient le tag {string}', (identifier, tagName) => {
  I.see(tagName, '#bank-detail-'+identifier+' mat-chip-list');
});

Given('je suis sur détail du pokemon avec l\'identifiant {string}', (idPoke) => {
  I.amOnPage(config.front.url+'/bank');
  I.click("#owned-poke-"+idPoke+" td:first-child");
});

When('je clique sur l\'option de fermeture du détail', () => {
  I.click('#bank-detail-close');
});

Then('le détail n\'est pas affiché', () => {
  I.dontSeeElement('app-bank-detail');
});

When('je clique sur l\'option de suppression du pokemon dont l\'identifiant est {string}', (idPoke) => {
  I.click("#owned-poke-"+idPoke+" td.col-type-options .bank-list-del-btn");
});

Then('le pokemon avec l\'identifiant {string} n\'est pas affiché dans la banque', (idPoke) => {
  I.dontSeeElement("#owned-poke-"+idPoke);
});

Then('le pokemon avec l\'identifiant {string} a un option de suppression', (idPoke) => {
  I.seeElement("#owned-poke-"+idPoke+" td.col-type-options .bank-list-del-btn");
});
