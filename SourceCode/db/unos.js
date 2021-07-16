const SQLutil = require("../models/SQLutil");

/**Unos jednog sudionika i jednog animatora */
if(true) {
    let sql = `INSERT INTO osoba (punoime, idosobe, motpismo, datumrod, email, brojtel)
    VALUES('Roger Federer', '815389622', 'pism', '1760-09-09', 'rogFed@losos.com', '0978602654');
    INSERT INTO racun (korisnickoime, lozinka, idosobe, vrracuna)
                                            VALUES('rfederer', 'sifra', 815389622, 'a');
    INSERT into animator values(815389622);
    INSERT INTO osoba (punoime, idosobe, motpismo, datumrod, email, brojtel)
    VALUES('Elias Kolega', '279136515', 'pism', '1780-09-09', 'elias@losos.com', '0978602653');
    INSERT INTO racun (korisnickoime, lozinka, idosobe, vrracuna)
                                            VALUES('ekolega', 'sifra', 279136515, 's');`;

    SQLutil.query(sql);
}

