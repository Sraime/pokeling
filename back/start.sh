#!/bin/bash

cd /pokelink_back
if [ $NODE_ENV = prod ]
then
    npm install --only=prod
    npm start
else
    npm install
    npm run start:nodemon
fi