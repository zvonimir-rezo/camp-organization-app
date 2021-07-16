const express = require('express');
const router = express.Router();
const Osoba = require('../models/Osoba');
const Grupa = require('../models/Grupa');
const Sudionik = require('../models/Sudionik');
const Animator = require('../models/Animator');
const Kamp = require('../models/Kamp');

router.get('/', function (req, res, next) {
    (async() => {
        res.render('pregled_grupa', {
            title: 'Pregled Grupa',
            uloga: req.session.uloga,
            linkActive: 'pregled_grupa',
            user: req.session.user,
            kampPoceo: await Kamp.poceoKamp(),
            kamp: await Kamp.provjeriImaLiKampa(), //vraca objekt koji sadrzi informacije o pocetku kampa i trajanju
            potvrdeneOsobe: await Osoba.getAllConfirmed(), //vraca potvrdene osobe koje nisu organizatori ili animatori
            grupe: await Grupa.fetchAllGroups(), //vraca sve grupe
            sudionici: await Sudionik.fetchAllParticipants(), //vraca sve sudionike(sudionik je samo idosobe i naziv grupe)
            korisnikovaGrupa : await Osoba.getGroupByUsername(req.session.user, req.session.uloga),
            animatori: await Animator.dohvatiAnimatore(req.session.user)
        });
    })();
});

module.exports = router;
