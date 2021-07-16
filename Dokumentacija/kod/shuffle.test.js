const expect = require('chai').expect;
const assert = require('assert');


describe('Shuffle Test', () => {
    
    it('liste trebaju imati ispremiješane elemente',async () => {
        let array = [1, 2, 1, 2, 3, 3];
        let arrayShuffled = [1, 2, 1, 2, 3, 3];
        arrayShuffled = shuffle(arrayShuffled);
        console.log(array);
        console.log(arrayShuffled);
        assert.notStrictEqual(array, arrayShuffled);
    });

    it('liste trebaju imati iste elemente', () => {
        let array = [1, 2, 1, 2, 3, 3];
        let arrayShuffled = [1, 2, 1, 2, 3, 3];
        arrayShuffled = shuffle(arrayShuffled);
        expect(array).to.have.same.members(arrayShuffled);
    });
});

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}