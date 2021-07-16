const express = require('express');
const Kamp = require('../models/Kamp');
const AnimatorISudionik = require('../models/AnimatorISudionik');
const Prijava = require('../models/Prijava');
const router = express.Router();

router.get('/', function (req, res, next) {
    (async() => {
        res.render('za_organizatore', {
            title: 'Za organizatore',
            uloga: req.session.uloga,
            kampPoceo: await Kamp.poceoKamp(),
            prijavljeniAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
            prijavljeniSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
            prijave: await Prijava.fetchAllAplications(),
            linkActive: 'za_organizatore',
            user: req.session.user,
            imaKampa: (await Kamp.provjeriImaLiKampa()).pocetak != undefined,
            errKamp: undefined,
            errPrijava: undefined
        });
    })();
        
});


router.post('/prijave', function (req, res, next) { //todo ako je kamp poceo poceo onemoguci ovo
    (async () => {
        if(await Prijava.pocetakPrijavePoslijeKampa(req.body.pocetakprijave)) {
            res.render('za_organizatore', {
                title: 'Za organizatore',
                uloga: req.session.uloga,
                prijavljeniAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
                prijavljeniSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
                prijave: await Prijava.fetchAllAplications(),
                kampPoceo: await Kamp.poceoKamp(),
                linkActive: 'za_organizatore',
                user: req.session.user,
                imaKampa: (await Kamp.provjeriImaLiKampa()).pocetak != undefined,
                errKamp: undefined,
                errPrijava: 'Prijava mora započeti prije početka kampa!'
            });
            return
        }

        let prijava = new Prijava(req.body.odabir, req.body.pocetakprijave, req.body.trajanjeprijave);

        //todo prijavu u bazu
        prijava.persist();
        res.redirect('/za_organizatore');
    })();
});

/**
 * Kreiranje kampa
 */
router.post('/kamp', function (req, res, next) {
    (async () => {
        if (new Date(req.body.pocetakkampa) < new Date()) {
            res.render('za_organizatore', {
                title: 'Za organizatore',
                uloga: req.session.uloga,
                prijavljeniAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
                prijavljeniSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
                kampPoceo: await Kamp.poceoKamp(),
                linkActive: 'za_organizatore',
                user: req.session.user,
                imaKampa: false,
                errKamp: "Kamp mora početi nakon današnjeg datuma!",
                errPrijava: undefined
            });
            return
        }

        kamp = new Kamp(req.body.pocetakkampa, req.body.trajanjekampa);
        kamp.persist();
        
        res.redirect('/');
    })();
});

/**
 * Otkazivanje kampa
 */
router.post('/otkazi', function (req, res, next) {
    (async () => {
        await Kamp.otkaziKamp();
        res.redirect('/za_organizatore');
    })();
});

/**
 * Otkazi prijavu
 */
router.post('/otkazi_prijavu', function(req, res, next) {
    (async () => {
        let idPrijave = req.body.idPrijave;
        await Prijava.otkaziPrijavu(idPrijave);

        res.redirect('/za_organizatore');
    })();
});



module.exports = router;
