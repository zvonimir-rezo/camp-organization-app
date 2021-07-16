const express = require('express');
const Aktivnost = require('../models/Aktivnost');
const DojamAktivnosti = require('../models/DojamAktivnosti');
const UkupanDojam = require('../models/UkupanDojam');
const router = express.Router();
const Kamp = require('../models/Kamp');

router.get('/', function (req, res, next) {
    (async() => {
        res.render('ocijeni_aktivnosti', {
            title: 'Ocijeni aktivnosti',
            uloga: req.session.uloga,
            linkActive: 'ocijeni_aktivnosti',
            user: req.session.user,
            kampPoceo: await Kamp.poceoKamp(),
            unratedUserActivities: await Aktivnost.fetchAllUnratedActivitiesForUser(req.session.user),
            unratedAnimatorActivities: await Aktivnost.fetchAllUnratedActivitiesForAnimator(req.session.user),
            ukupanDojamEntered: await UkupanDojam.checkIfDojamEntered(req.session.user),
            kampGotov: await Kamp.kampGotov()
        });
    })();
});

router.post('/dojamaktivnosti', function (req, res, next) {
    (async () => {
        let idOsobe = await DojamAktivnosti.getId(req.session.user);

        let dojamAktivnosti = new DojamAktivnosti(idOsobe, req.body.nazivakt, req.body.ocjena, req.body.dojam); //pogledaj prijava.routes liniju 38, možda bolje da koristis req.session.user

        dojamAktivnosti.persist(); //dodavanje ocjene i dojma u bazu

        res.redirect('/ocijeni_aktivnosti');
    })();
});

router.post('/ukupandojam', function (req, res, next) {
    (async () => {
        let idOsobe = await DojamAktivnosti.getId(req.session.user);

        let dojam = new UkupanDojam(idOsobe, req.body.ocjena, req.body.dojam); //pogledaj prijava.routes liniju 38, možda bolje da koristis req.session.user

        dojam.persist(); //dodavanje ocjene i dojma u bazu

        res.redirect('/');
    })();
});

module.exports = router;
