const assert = require('assert');
const Grupa = require('../models/Grupa');

describe('Grupa Test', () => {
    it('treba vratiti naziv grupe', async () => {
        let grupa = new Grupa("grupa 1")
        await grupa.persist();
        let result = await Grupa.fetchAllGroups();
        assert.equal(result[0].naziv, "grupa 1");
    });
});