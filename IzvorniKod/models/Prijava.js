// prijava
const db = require("../db");
var parse = require('postgres-interval')
const SQLutil = require("./SQLutil");
module.exports = class Prijava
{
    constructor(prijavaZa, vrijemePocetka, vrijemeTrajanja, idPrijave)
    {
        this.idPrijave = idPrijave;
        this.prijavaZa = prijavaZa;
        this.vrijemePocetka = vrijemePocetka;
        this.vrijemeTrajanja = vrijemeTrajanja * 24 * 3600;
    }

    static async fetchAllAplications()
    {
        let results = await dbGetApplications();
        let applications = new Array();


        if(results.length > 0)
        {
            results.forEach(appl => {
                applications.push(new Prijava(appl.prijavaza, String(appl.vrijemepocetka).slice(0, 24), Number(appl.vrijemetrajanja.hours) / 24 / 24 /3600, //zbog constr
                    appl.idprijave));
            });
        }
        return applications;
    }
    
    async persist()
    {
        try{
            dbNewApplication(this);
        }
        catch(err)
        {
            console.log('err persisting application: ' + JSON.stringify(this));
            throw err;
        }
    }

    /**
     * Provjerava jesu li prijave otvorene. 
     * @param {String} animatorIliSudionik 
     */
    static async prijaveOtvorene(animatorIliSudionik) {
        if(animatorIliSudionik.toLowerCase() != 'animator' && animatorIliSudionik.toLowerCase() != 'sudionik') throw 'Krivi argument metodi prijave Otvorene';
        
        const sql = `SELECT vrijemepocetka, vrijemetrajanja FROM prijava 
        WHERE current_timestamp >= vrijemepocetka 
        AND current_timestamp <= vrijemepocetka + vrijemetrajanja
        AND (prijavaza = '${animatorIliSudionik}'
        OR prijavaza = 'oboje')`;

        let result = await SQLutil.query(sql);

        return result.length > 0;
    }

    /**
     * Provjerava je li pocetak prijave poslije pocetka kampa
     * @param {String} prijava 
     */
    static async pocetakPrijavePoslijeKampa(prijava) {
        const sql = `SELECT * FROM kamp WHERE '${prijava.replace('T', ' ') + ":00"}' > vrijeme_pocetka`;

        let result = await SQLutil.query(sql);

        return result.length > 0; 
    }

    static async nemaPrijava() {
        const sql = `SELECT * FROM prijava`;
        let result = await SQLutil.query(sql);
        return result.length === 0;
    }

    /**
	 * Otkazuje prijavu
	 */
	static async otkaziPrijavu(idPrijave) {
		const sql = `DELETE FROM prijava WHERE idPrijave = ${idPrijave}`;

		await SQLutil.query(sql);
    }

};

dbGetApplications = async () => {
    const sql = 'SELECT idPrijave, prijavaZa, vrijemePocetka, vrijemeTrajanja FROM prijava;';
    let result = SQLutil.query(sql);
    return result;
};

dbNewApplication = async (appl) => {
    const sql =
       "INSERT INTO prijava (prijavaZa, vrijemePocetka, vrijemeTrajanja) VALUES(\'" + appl.prijavaZa + "\', \'" + appl.vrijemePocetka + "\', \'" + appl.vrijemeTrajanja + "\')";
    SQLutil.query(sql);
};
