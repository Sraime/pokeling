const bankService = require('../../services/bank/bank.service');
const bankController = require('./bank.controller');

describe('bank.controller', () => {
    
    describe('getOwnedPokemons()', () => {
        const spyGetOwned = jest.spyOn(bankService, 'getOwned');
        let res;
        let req;

        beforeEach(() => {
            res = {
                json: jest.fn()
            }
            req = {
                user: {pseudo: 'admin'}
            }
        });

        it('should return an empty array when the service return an empty array', async() => {
            const serviceReturn = [];
            spyGetOwned.mockReturnValue(serviceReturn);
            let rs = await bankController.getOwnedPokemons(req, res);
            expect(spyGetOwned).toHaveBeenCalledWith(req.user.pseudo);
            expect(res.json).toHaveBeenCalledWith(serviceReturn);
        });

        it('should the list of owned pokemon returned by the service', async() => {
            const serviceReturn = [{name_fr: 'Pitchu', name_fr: 'Pitchu', userPseudo:'admin', tags: []}];
            spyGetOwned.mockReturnValue(serviceReturn);
            let rs = await bankController.getOwnedPokemons(req, res);
            expect(res.json).toHaveBeenCalledWith(serviceReturn);
        });
    });
});