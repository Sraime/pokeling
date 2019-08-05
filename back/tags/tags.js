var mongoose = require('mongoose');
var config = require('../config');
var moveModel = require('./move')
var tagModel = require('./tag')


var mongoDB = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;
mongoose.connect(mongoDB, { useNewUrlParser: true })
.then(() => {
  console.log('Connection to database has been established successfully.');
})
.catch(err => {
  console.log('Unable to connect to the database:', err);
});

const type = 'move';
var ntag;
moveModel.find({}).then((data) => {
  data.forEach((e) => {
    console.log(e.name_fr);
    ntag = new tagModel({name_fr: e.name_fr, name_en: e.name, type: type});
    ntag.save();
  })
})



