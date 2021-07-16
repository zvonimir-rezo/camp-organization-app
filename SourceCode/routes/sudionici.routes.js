const express = require('express');
const router = express.Router();
const Aktivnost = require('../models/Aktivnost');
const Animator = require('../models/Animator')
const AnimatorISudionik = require('../models/AnimatorISudionik');
const Osoba = require('../models/Osoba');
const Grupa = require('../models/Grupa');
const Sudionik = require('../models/Sudionik');
const Prijava = require('../models/Prijava');
const AktivnostTocnoNGrupa = require('../models/AktivnostTocnoNGrupa');
const AktivnostSamoJednaGrupa = require('../models/AktivnostSamoJednaGrupa');
const AktivnostMaxNGrupa = require('../models/AktivnostMaxNGrupa');
const AktivnostSveGrupe = require('../models/AktivnostSveGrupe');
const Raspored = require('../models/Raspored');
const DojamAktivnosti = require('../models/DojamAktivnosti');
const Kamp = require('../models/Kamp');
let dojmovi = new Array();


//ovaj router je za organizatore da dodaju aktivnosti te razmještaju sudionike

router.get('/', async function (req, res, next) {
    dojmovi = await DojamAktivnosti.fetchAllDojmovi();
    res.render('sudionici', {
        title: 'Sudionici',
        uloga: req.session.uloga,
        linkActive: 'sudionici',
        user: req.session.user,
        err: undefined,
        potvrdeneOsobe: await Osoba.getAllConfirmed(),
        nepotvrdenePrijaveAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
        nepotvrdenePrijaveSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
        prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
        prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
        grupe: await Grupa.fetchAllGroups(),
        sudionici: await Sudionik.fetchAllParticipants(),
        imaRaspored: (await Raspored.dohvatiRaspored()).length != 0,
        dojmovi: dojmovi,
        kampPoceo: await Kamp.poceoKamp(),
    });
});


router.post('/filter_dojmovi', async function (req, res, next) {
    let filterBy = req.body.filterBy;
    (async () => {
        if (filterBy == 1) {
            let osoba = req.body.filter;
            dojmovi = await DojamAktivnosti.filterDojmoviByOsoba(dojmovi, osoba);
        } else if (filterBy == 2) {
            let grupa = req.body.filter;
            dojmovi = await DojamAktivnosti.filterDojmoviByGrupa(dojmovi, grupa);
        } else {
            let aktivnost = req.body.filter;
            dojmovi = await DojamAktivnosti.filterDojmoviByAktivnost(dojmovi, aktivnost);
        }
        res.render('sudionici', {
            title: 'Sudionici',
            uloga: req.session.uloga,
            linkActive: 'sudionici',
            user: req.session.user,
            err: undefined,
            potvrdeneOsobe: await Osoba.getAllConfirmed(),
            nepotvrdenePrijaveAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
            nepotvrdenePrijaveSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
            prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
            prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
            grupe: await Grupa.fetchAllGroups(),
            sudionici: await Sudionik.fetchAllParticipants(),
            imaRaspored: (await Raspored.dohvatiRaspored()).length != 0,
            dojmovi: dojmovi,
            kampPoceo: await Kamp.poceoKamp(),
        });
    })();
});


router.post('/aktivnosti', function (req, res, next) {
    
    (async () => {
        let aktivnost;
        if(req.body.tip == 'tocnon') {
            aktivnost = new AktivnostTocnoNGrupa(req.body.imeaktivnost, req.body.kratkiopis, req.body.trajanje, req.body.brojgrupa);
        }
        else if(req.body.tip == 'maxn') {
            aktivnost = new AktivnostMaxNGrupa(req.body.imeaktivnost, req.body.kratkiopis, req.body.trajanje, req.body.brojgrupa);
        }
        else if(req.body.tip == 'jedna') {
            aktivnost = new AktivnostSamoJednaGrupa(req.body.imeaktivnost, req.body.kratkiopis, req.body.trajanje);
        }
        else if(req.body.tip == 'sve') {
            aktivnost = new AktivnostSveGrupe(req.body.imeaktivnost, req.body.kratkiopis, req.body.trajanje);
        }
        else  {
            throw  'aktivnosti incorrect form';
        }

        aktivnost.persist();
            //prijava u bazu
        res.redirect('/sudionici');
    })();
});

router.post('/grupe', function (req, res, next) {
    let brojGrupa = req.body.brojgrupa;
    (async () => {
        console.log(brojGrupa);
        for (let i = 0; i < brojGrupa; i++) {
            //console.log(i);
            let grupa = new Grupa("Grupa ".concat((i+1).toString()));
            await grupa.persist();
        }
        await Osoba.razvrstajUGrupe();
        
        res.redirect('/');
    })();
});

router.post('/prebaci', function (req, res, next) {
    (async () => {
        await Sudionik.removeById(req.body.idosobe);
        let sudionik = new Sudionik(req.body.idosobe, req.body.odabirgrupe);
        await sudionik.addToDb();
        // res.redirect('/sudionici');
        res.render('sudionici', {
            title: 'Sudionici',
            uloga: req.session.uloga,
            linkActive: 'sudionici',
            user: req.session.user,
            kampPoceo: await Kamp.poceoKamp(),
            err: undefined,
            potvrdeneOsobe: await Osoba.getAllConfirmed(),
            nepotvrdenePrijaveAnimatori: await AnimatorISudionik.fetchNotConfirmedApplications(true),
            nepotvrdenePrijaveSudionici: await AnimatorISudionik.fetchNotConfirmedApplications(false),
            prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
            prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
            grupe: await Grupa.fetchAllGroups(),
            sudionici: await Sudionik.fetchAllParticipants(),
            imaRaspored: (await Raspored.dohvatiRaspored()).length != 0,
            dojmovi: DojamAktivnosti.fetchAllDojmovi()
        });
    })();
});

router.get('/formiraj', function (req, res, next) {
    (async() => {
        
        let rasp = await Raspored.dohvatiRaspored();
        if(rasp.length == 0) {
            Raspored.formiraj();
        }

        res.render('formiraj', {
            title: 'Sudionici',
            uloga: req.session.uloga,
            linkActive: 'sudionici',
            user: req.session.user,
            kampPoceo: await Kamp.poceoKamp(),
            aktivnosti: await Aktivnost.fetchAllActivitiesNotEating(),
            grupe: await Grupa.fetchAllGroups(),
            animatori: await Animator.fetchAnimatorNames(),
            raspored: await Raspored.dohvatiRaspored(),
            errDodaj: undefined,
            errZavrsi: undefined
        });
    })();
})

router.post('/formiraj/dodaj', function (req, res, next) {
    (async() => {
        let grupe = new Array(); 
        if(typeof(req.body.grupa) == 'string') {
            grupe.push(req.body.grupa);
        } else {
            grupe = req.body.grupa;
        }

        let animatori = new Array();
        if(typeof(req.body.animator) == 'string') {
            animatori.push(req.body.animator);
        } else {
            animatori = req.body.animator;
        }
        
        let result = await Raspored.dodajAktivnost(req.body.aktivnost,
            parseInt(req.body.dan),
            String(req.body.vrijeme).slice(0, 2),
            grupe,
            animatori
        );

        console.log(result);
        if(result.uspjeh == false) { 
            res.render('formiraj', {
                title: 'Sudionici',
                uloga: req.session.uloga,
                linkActive: 'sudionici',
                user: req.session.user,
                kampPoceo: await Kamp.poceoKamp(),
                aktivnosti: await Aktivnost.fetchAllActivitiesNotEating(),
                grupe: await Grupa.fetchAllGroups(),
                animatori: await Animator.fetchAnimatorNames(),
                raspored: await Raspored.dohvatiRaspored(),
                errDodaj: result.err,
                errZavrsi: undefined
            });
            return;
        }
        
        res.redirect('/sudionici/formiraj');
    })();
})


router.post('/formiraj/zavrsi', function (req, res, next) {
    (async() => {
        let result = await Raspored.zavrsiDodavanjeAktivnosti();
        if(result.uspjeh == false) {
            res.render('formiraj', {
                title: 'Sudionici',
                uloga: req.session.uloga,
                linkActive: 'sudionici',
                user: req.session.user,
                kampPoceo: await Kamp.poceoKamp(),
                aktivnosti: await Aktivnost.fetchAllActivitiesNotEating(),
                grupe: await Grupa.fetchAllGroups(),
                animatori: await Animator.fetchAnimatorNames(),
                raspored: await Raspored.dohvatiRaspored(),
                errDodaj: undefined, 
                errZavrsi: result.err
           });
           return;
        }

        res.redirect('/sudionici');
    })();
})

module.exports = router;
