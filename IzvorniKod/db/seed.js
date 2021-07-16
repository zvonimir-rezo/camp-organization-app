const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'kampMladeNade',
    password: 'bazepodataka',
    port: 5432,
});


const sql_create_organizator = `CREATE TABLE organizator (
    idOrganizatora INTEGER PRIMARY KEY,
    FOREIGN KEY (idOrganizatora) REFERENCES osoba (Idosobe)
)`;

const sql_create_animator = `create table animator (
	idAnimatora INTEGER PRIMARY KEY,
    FOREIGN KEY (idAnimatora) REFERENCES osoba (Idosobe)
)`;

const sql_create_kamp = `CREATE TABLE kamp(
	vrijeme_pocetka timestamp,
	trajanje interval
)`;


const sql_create_aktivnost = `CREATE TABLE aktivnost(
	nazivAkt VARCHAR PRIMARY KEY,
	opis VARCHAR,
	trajanje interval
)`;

const sql_create_aktivnost1 = `CREATE TABLE aktivnost1(
	nazivAkt VARCHAR,
	PRIMARY KEY (nazivAkt),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)
`;

const sql_create_aktivnostN = `CREATE TABLE aktivnostN(
    nazivAkt VARCHAR,
    brojGrupa INTEGER,
	PRIMARY KEY (nazivAkt),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;


const sql_create_aktivnostMaxN = `CREATE TABLE aktivnostMaxN(
    nazivAkt VARCHAR,
    brojGrupa INTEGER,
    PRIMARY KEY (nazivAkt),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;

const sql_create_aktivnostSve = `CREATE TABLE aktivnostSve(
	nazivAkt VARCHAR,
	PRIMARY KEY (nazivAkt),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;


const sql_create_grupa = `CREATE TABLE grupa(
	nazivGrupa VARCHAR PRIMARY KEY
)`;

const sql_create_sudjeluje = `CREATE TABLE sudjeluje(
	nazivGrupa VARCHAR,
    nazivAkt VARCHAR,
    dan integer,
    vrijeme time,
    PRIMARY KEY (nazivGrupa, nazivAkt, dan, vrijeme),
	FOREIGN KEY (nazivGrupa) REFERENCES grupa (nazivGrupa),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;


const sql_create_prijava = `CREATE TABLE prijava(
    idPrijave SERIAL PRIMARY KEY,
    prijavaZa VARCHAR,
    vrijemePocetka timestamp,
    vrijemeTrajanja interval
)`;

const sql_create_osoba = `CREATE TABLE osoba(
	punoIme VARCHAR,
	Idosobe INTEGER PRIMARY KEY,
	motPismo VARCHAR,
	datumRod date,
	brojTelefonaOdgOsobe VARCHAR,
	email VARCHAR,
	brojTel VARCHAR
)`;


const sql_create_sudionik = `CREATE TABLE sudionik(
    Idosobe INTEGER PRIMARY KEY,
	nazivGrupa VARCHAR,
	FOREIGN KEY (Idosobe) REFERENCES osoba (Idosobe),
	FOREIGN KEY (nazivGrupa) REFERENCES grupa (nazivGrupa)
)`;

const sql_create_racun = `CREATE TABLE racun(
	korisnickoIme VARCHAR,
	lozinka VARCHAR,
    Idosobe INTEGER NOT NULL,
    vrRacuna char(1),
	PRIMARY KEY (Idosobe, korisnickoIme),
	FOREIGN KEY (Idosobe) REFERENCES osoba(Idosobe)
)`;


const sql_create_animator_sudjeluje = `CREATE TABLE animatorsudjeluje(
	Idosobe INTEGER,
    nazivAkt VARCHAR NOT NULL,
    vrijeme time,
    dan integer,
    PRIMARY KEY (Idosobe, nazivAkt, dan, vrijeme),
	FOREIGN KEY (Idosobe) REFERENCES osoba (Idosobe),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;

const sql_create_dojam = `CREATE TABLE dojam(
	Idosobe INTEGER NOT NULL,
	ocjena INTEGER,
	komentar VARCHAR,
	FOREIGN KEY (Idosobe) REFERENCES osoba (Idosobe),
	PRIMARY KEY (Idosobe)
)`;

const sql_create_sessions = `CREATE TABLE session (
    sid varchar NOT NULL COLLATE "default" PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);`;

const sql_create_dojamAktivnosti = `CREATE TABLE dojamAktivnosti(
    Idosobe INTEGER NOT NULL,
    nazivAkt VARCHAR NOT NULL,
	ocjena INTEGER,
	komentar VARCHAR,
	FOREIGN KEY (Idosobe) REFERENCES osoba (Idosobe),
	FOREIGN KEY (nazivAkt) REFERENCES aktivnost (nazivAkt)
)`;


let table_names = [
    'osoba',
    'organizator',
    'kamp',
    'aktivnost',
    'aktivnost1',
    'aktivnostN',
    'aktivnostMaxN',
    'aktivnostSve',
    'grupa',
    'sudjeluje',
    'prijava',
    'sudionik',
    'racun',
    'animator',
    'dojam',
    'sessions',
    'animatorsudjeluje',
    'dojamAktivnosti'
];

let tables = [
    sql_create_osoba,
    sql_create_organizator,
    sql_create_kamp,
    sql_create_aktivnost,
    sql_create_aktivnost1,
    sql_create_aktivnostN,
    sql_create_aktivnostMaxN,
    sql_create_aktivnostSve,
    sql_create_grupa,
    sql_create_sudjeluje,
    sql_create_prijava,
    sql_create_sudionik,
    sql_create_racun,
    sql_create_animator,
    sql_create_dojam,
    sql_create_sessions,
    sql_create_animator_sudjeluje,
    sql_create_dojamAktivnosti
];

let table_data = [
    "insert into osoba (punoime, idosobe, datumrod, email, brojtel) values('Petar Stojanovic', -1282510150, '09/11/1989', 'petar.stojanovic@gmail.com', '091675234')",
    "insert into organizator values(-1282510150)",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "insert into racun values('pstojanovic', 'admin', -1282510150, 'o')",
    undefined,
    undefined,
    undefined,
    undefined
];


if ((tables.length != table_data.length) || (tables.length != table_names.length)) {
    console.log('tables, names and data arrays length mismatch.');
    return;
}

//CREATE TABLEs and populate with data (if provided) 

(async () => {
    console.log('Creating and populating tables');
    for (let i = 0; i < tables.length; i++) {
        console.log('Creating table ' + table_names[i] + '.');
        try {
            await pool.query(tables[i], []);
            console.log('Table ' + table_names[i] + ' created.');
            if (table_data[i] !== undefined) {
                try {
                    await pool.query(table_data[i], []);
                    console.log('Table ' + table_names[i] + ' populated with data.');
                } catch (err) {
                    console.log('Error populating table ' + table_names[i] + ' with data.');
                    return console.log(err.message);
                }
            }
        } catch (err) {
            console.log('Error creating table ' + table_names[i]);
            return console.log(err.message);
        }
    }

})();
