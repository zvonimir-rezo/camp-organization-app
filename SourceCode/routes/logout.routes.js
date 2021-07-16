const express = require('express');
const router = express.Router();
const Kamp = require('../models/Kamp');

router.get('/', function (req, res, next) {
    req.session.user = undefined;
    req.session.uloga = undefined;

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.redirect('/');
        }
    });

});

module.exports = router;