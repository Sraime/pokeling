const bankService = require('../../services/bank/bank.service');

const BankController = {

    getOwnedPokemons: async(req, res) => {
        let pokes = await bankService.getOwned(req.user.pseudo);
        res.json(pokes);
    }
}

module.exports = BankController;