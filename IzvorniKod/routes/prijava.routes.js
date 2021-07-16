const express = require('express');
const Korisnik = require('../models/Korisnik');
const router = express.Router();
const Kamp = require('../models/Kamp');

/**
 * Vraća stranicu za prijavu
 */
router.get('/', function (req, res, next) {
    res.render('prijava', {
        title: 'Prijava',
        linkActive: 'prijava',
        uloga: req.session.uloga,
        user: req.session.user,
        // kampPoceo: await Kamp.poceoKamp(),
        kampPoceo: false,
        err: undefined
    });
});

/**
 * Prijava već registriranog sudionika, animatora ili organizatora
 */
router.post('/', function (req, res, next) {
    (async () => {
        korisnik = new Korisnik(req.body.username, req.body.password);
        results = await korisnik.prijava();

        if(results.length == 0) {
            res.render('prijava', {
                title: 'Prijava', 
                linkActive: 'prijava',
                uloga: req.session.uloga,
                user: req.session.user,
                kampPoceo: await Kamp.poceoKamp(),
                err: 'Wrong username or password! Please try again'
            });
            return;
        }

        req.session.user = korisnik.korisnickoIme;
        //req.session.userId = korisnik. za ovo ces morati radit novi upit na bazu. 
        //Mozes koristit req.session.user kao kljuc za korisnika
        req.session.uloga = results[0].vrracuna;
        
        res.redirect('/')
    })();
}); 
module.exports = router;
