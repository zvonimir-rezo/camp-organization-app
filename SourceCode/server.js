//uvoz modula
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const db = require('./db');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require('./routes/home.routes');
const signupRoute = require('./routes/registracija.routes');
const signinRoute = require('./routes/prijava.routes');
const logoutRoute = require('./routes/logout.routes');
const organizatoriRoute = require('./routes/za_organizatore.routes');
const sudioniciRoute = require('./routes/sudionici.routes'); //za upravljanje sudionicima i grupama od strane organizatora
const pregledGrupaRoute = require('./routes/pregled_grupa.routes'); 
const ocijeniAktivnostiRoute = require('./routes/ocijeni_aktivnosti.routes'); 

//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

//middleware - dekodiranje parametara
app.use(express.urlencoded({extended: true}));


app.use(session({
    secret: 'secret',
    resave: false,
    cookie: {
        maxAge: 1000 * 3600 * 24,
        secure: false
    },
    store: new pgSession({
        pool: db.pool,
        tableName: 'session'
    }),
    saveUninitialized: true
    }));
    

//definicija ruta
app.use('/', homeRouter);
app.use('/registracija', signupRoute);
app.use('/logout', logoutRoute);
app.use('/za_organizatore', organizatoriRoute);
app.use('/prijava', signinRoute);
app.use('/sudionici', sudioniciRoute);
app.use('/pregled_grupa', pregledGrupaRoute);
app.use('/ocijeni_aktivnosti', ocijeniAktivnostiRoute);


// app.userData = new UserData('users.json');
// app.userData.initialize(true);

//pokretanje poslužitelja na portu 3000
app.listen(3000);
