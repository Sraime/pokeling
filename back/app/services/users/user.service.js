const UserModel = require('../../models/user.model')
const bcrypt = require('bcryptjs');

const UserService = {

    getUserByEmail : async (email) => {
        return UserModel.findOne({email: email})
    },

    isCorrectPassword: async (password, encodedPassword) => {
        return bcrypt.compare(password, encodedPassword);
    },

    insertUser: async (user) => {
        let nu = new UserModel(user);
        return nu.save();
    },

    getUserByPseudo(pseudo) {
        return UserModel.findOne({pseudo: pseudo});
    }
}

module.exports = UserService;