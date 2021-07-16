const db = require('../db');
const SQLutil = require('./SQLutil');

//razred Aktivnost enkapsulira Aktivnost
module.exports = class Aktivnost{

    constructor(ime, kratkiOpis, trajanje, brojGrupa) {
		this.ime = ime;
		this.kratkiOpis = kratkiOpis;
        this.trajanje = trajanje * 3600;
        this.brojGrupa = brojGrupa;
	}

	async persist()
    {
        const sql = "INSERT INTO aktivnost (nazivakt, opis, trajanje) VALUES(\'" + this.ime + "\', \'" + this.kratkiOpis + "\', \'" + this.trajanje + "\')";
        SQLutil.query(sql);
    }

    static async fetchAllActivities1()
    {
        const sql = 'SELECT * FROM aktivnost;';

        let results = await SQLutil.query(sql);
        
        let activities = new Array();

        if(results.length > 0)
        {
            results.forEach( (activity) => {
                activities.push(new Aktivnost(activity.nazivakt, activity.opis, activity.trajanje.hours / 3600));
            });
        }
        
        return activities;
    }  

    static async fetchAllUnratedActivitiesForUser(korisnickoIme) {
        const idOsobeSql = `SELECT Idosobe FROM racun WHERE korisnickoIme = '${korisnickoIme}'`;
        let osoba = await SQLutil.query(idOsobeSql);
        const sql = `SELECT * FROM aktivnost WHERE nazivAkt NOT IN (SELECT nazivAkt FROM dojamAktivnosti WHERE Idosobe = ${osoba[0].idosobe});`;
        let results = await SQLutil.query(sql);

        let activities = new Array();
        if(results.length > 0)
        {
            results.forEach( (activity) => {
                activities.push(new Aktivnost(activity.nazivakt, activity.opis, activity.trajanje.hours / 3600));
            });
        }
        
        return activities;
    }

    static async fetchAllActivitiesNotEating()
    {
        const sql = `SELECT * FROM aktivnost WHERE nazivakt <> 'Dorucak' AND nazivakt <> 'Rucak' AND nazivakt <> 'Vecera'`;

        let results = await SQLutil.query(sql);
        
        let activities = new Array();

        if(results.length > 0)
        {
            results.forEach( (activity) => {
                activities.push(new Aktivnost(activity.nazivakt, activity.opis, activity.trajanje.hours / 3600));
            });
        }
        
        return activities;
    }  

    static async fetchAllUnratedActivitiesForAnimator(korisnickoIme) {
        const sql = `SELECT DISTINCT nazivakt, opis, trajanje FROM animatorsudjeluje NATURAL JOIN racun NATURAL JOIN aktivnost WHERE korisnickoime = '${korisnickoIme}' AND nazivakt NOT IN (SELECT nazivAkt FROM dojamAktivnosti NATURAL JOIN racun WHERE korisnickoime = '${korisnickoIme}')`;
        let results = await SQLutil.query(sql);

        let activities = new Array();
        if(results.length > 0)
        {
            results.forEach( (activity) => {
                activities.push(new Aktivnost(activity.nazivakt, activity.opis, activity.trajanje.hours / 3600));
            });
        }

        console.log("aktivnosti ima " + activities.length);
        
        return activities;
    }

    
}



