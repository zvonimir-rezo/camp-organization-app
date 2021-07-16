const assert = require('assert');
const Kamp = require('../models/Kamp');

describe('Kamp Test', () => {
    it('treba vratiti undefined jer nema kampa', () => {
        assert.equal(undefined, Kamp.provjeriImaLiKampa().pocetak);
    });
    
    it('treba vratiti 2',async () => {
        let kamp = new Kamp("2021-01-14T18:47", 2, []);
        await kamp.persist();
        let result = await Kamp.provjeriImaLiKampa();
        assert.equal(result.trajanje, 2);
        await Kamp.otkaziKamp();
    });
});