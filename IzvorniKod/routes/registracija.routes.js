const express = require('express');
const Korisnik = require('../models/Korisnik');
const router = express.Router();
const MailSender = require('../models/MailSender');
const Osoba = require('../models/Osoba');
const Animator = require('../models/Animator');
const SudionikStarijiOd18 = require('../models/SudionikStarijiOd18');
const SudionikMladiOd18 = require('../models/SudionikMladiOd18');
const Prijava = require('../models/Prijava');
const Kamp = require('../models/Kamp');


//vrati signup stranicu
router.get('/', function (req, res, next) {
    (async () => {
        res.render('registracija', {
            title: 'Register a new user',
            linkActive: 'registracija',
            uloga: req.session.uloga,
            err: undefined,
            user: req.session.user,
            prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
            prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
            kampPoceo: await Kamp.poceoKamp(),
        });
    })();
});

router.post('/', function (req, res, next) {
    (async () => {
        
        if(await Osoba.provjeriEmail(req.body.email)) {
            res.render('registracija', {
                title: 'Register a new user',
                linkActive: 'registracija',
                uloga: req.session.uloga,
                user: req.session.user,
                err: 'Poslani email već postoji. Molimo pokušajte ponovo!',
                prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
                prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
                kampPoceo: await Kamp.poceoKamp(),
                }
            )
            return
        }
        
        let novaOsoba = null;

        if(req.body.opcija == 'animator') {
            novaOsoba = new Animator(req.body.firstname + " " + req.body.lastname, req.body.email, req.body.phonenumber, req.body.birthday, req.body.letter);
            novaOsoba.persist(); //dodavanje osobe u bazu
            novaOsoba.addToDb(await novaOsoba.idHash()); //dodavanje animatora
            res.redirect('/');
            
            return;

        } else if(req.body.opcija == 'sudionik') {
            console.log("ppn: " + req.body.parent_phone_number);
            if(req.body.parent_phone_number == "") {
                novaOsoba = new SudionikStarijiOd18(req.body.firstname + " " + req.body.lastname, req.body.email, req.body.phonenumber, req.body.birthday, req.body.letter);
            } else {
                novaOsoba = new SudionikMladiOd18(req.body.firstname + " " + req.body.lastname, req.body.email, req.body.phonenumber, req.body.birthday, req.body.letter, req.body.parent_phone_number);
            }

        } else throw 'Server error';

        novaOsoba.persist(); //dodavanje osobe u bazu

        res.redirect('/');
    })();
});

/**
 * Za potvrđivanje sudionika, zahtjev dolazi iz 'za_organizatore.ejs'
 */
router.post('/prihvati', function(req, res, next) {
        (async () => {
            let username = req.body.name.split(' ')[0][0].toLowerCase() + req.body.name.split(' ')[1].toLowerCase();
            username = await Korisnik.nadiPrihvatljiviUsername(username);
            
            let nkorisnik = new Korisnik(username, 'default', req.body.hash);
            
            nkorisnik.registracija();
            
            MailSender.send(req.body.email, username, 'accepted');

            res.redirect('/za_organizatore');
        })();
});

/**
 * Odbija zahtjev, briše iz baze osoba i animator
 */
router.post('/odbij', function(req, res, next) {
    (async () => {
        await Osoba.removeById(req.body.hash);
        
        MailSender.send(req.body.email, null, 'denied');

        res.redirect('/za_organizatore')
    })();
});

/**
 * Ovo se vraca kad korisnik pritisne link koji mu je poslan mailom
 */
router.get('/final', function (req, res, next) {
    (async () => {
        res.render('user_registracija', {
            title: 'Registracija',
            linkActive: 'registracija',
            uloga: req.session.uloga,
            user: undefined,
            err: undefined,
            prijaveSudionici: await Prijava.prijaveOtvorene('sudionik'),
            prijaveAnimatori: await Prijava.prijaveOtvorene('animator'),
            kampPoceo: await Kamp.poceoKamp(),
        });
    })();
});

/**
 * Za konačnu registraciju sudionika
 */
router.post('/final', function(req, res, next) {
    (async() => {
        let korisnik = new Korisnik(req.body.username, req.body.password);
        let results = await korisnik.promijeniLozinku();

        req.session.user = korisnik.korisnickoIme;
        req.session.uloga = results[0].vrracuna;
        
        res.redirect('/'); //todo dodaj usera u sesiju
    })();
});

module.exports = router;

