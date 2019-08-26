const env = process.env.NODE_ENV || 'dev'; 

const dev = {
    app: {
        env: env,
        port: 3000
    },
    auth: {
        secret: 'randomsecretpassword',
        expiresIn: 3600
    },
    mongodb: {
        host: 'localhost',
        port: 27017,
        db: 'pokelink'
    }
}

const test = {
    app: {
        env: env,
        port: 3001
    },
    auth: {
        secret: 'randomsecretpassword',
        expiresIn: 60
    },
    mongodb: {
        env: env,
        host: 'localhost',
        port: 27017,
        db: 'pokelink_test'
    }
}

const prod = {
    app: {
        port: 3000
    },
    auth: {
        secret: process.env.AUTH_SECRET,
        expiresIn: 43200
    },
    mongodb: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        db: process.env.DB_NAME
    }
}
const config = {
    dev,
    test,
    prod
};
module.exports = config[env];