// const assert = require('assert');
// const Sudionik = require('../models/Sudionik');
// const Grupa = require('../models/Grupa');
// const AnimatorISudionik = require('../models/AnimatorISudionik');

// describe('Sudionik Test', async () => {
//     let kamp = new Kamp("2021-01-14T18:47", 2, []);
//     await kamp.persist();
//     let grupa1 = new Grupa("grupa 1");
//     let grupa2 = new Grupa("grupa 2");
//     let sudionik1 = new Sudionik(1, "grupa 1");
//     let sudionik2 = new Sudionik(2, "grupa 2");
//     let sudionik3 = new Sudionik(3, "grupa 2");
//     let sudionik4 = new Sudionik(4, "grupa 1");
//     await grupa1.persist();
//     await grupa2.persist();
//     await sudionik1.addToDb();
//     await sudionik2.addToDb();
//     await sudionik3.addToDb();
//     await sudionik4.addToDb();
//     it('treba vratiti id sudionika', async () => {
//         let result = await Sudionik.fetchAllParticipants();
//         assert.equal(result[0].id, 1);
//     });
//     await Kamp.otkaziKamp();
// });