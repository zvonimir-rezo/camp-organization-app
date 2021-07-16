const express = require('express');
const Aktivnost = require('../models/Aktivnost');
const router = express.Router();
const Raspored = require('../models/Raspored')
const Kamp = require('../models/Kamp');

router.get('/', function (req, res, next) {
    (async() => {
        res.render('home', {
            title: 'Home',
            uloga: req.session.uloga,
            linkActive: 'home',
            user: req.session.user,
            kampPoceo: await Kamp.poceoKamp(),
            kamp: await Kamp.provjeriImaLiKampa(), //vraca objekt koji sadrzi informacije o pocetku kampa i trajanju
            activities: await Aktivnost.fetchAllActivities1(),
            aspored: await Raspored.dohvatiRasporedZaUsername(req.session.user, req.session.uloga),
        });
    })();
});

module.exports = router;
