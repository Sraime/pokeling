FROM node

WORKDIR /pokelink_back

COPY ./package.json .
RUN npm install

ENTRYPOINT ["npm", "start"]