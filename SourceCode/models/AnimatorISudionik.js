const Osoba = require('./Osoba');
const SQLutil = require('./SQLutil');

//razred AnimatorISudionik enkapsulira animatore i sudionike kampa
module.exports = class AnimatorISudionik extends Osoba{

    constructor(ime, email, brojTelefona, datGodRodenja, motivacijskoPismo, hash) {
		super(ime, email, brojTelefona, datGodRodenja);
		this.motivacijskoPismo = motivacijskoPismo;

		this.hash = hash;
	}

	
    /**
     * dodaje osobu u bazu
     */
    async persist() {
		let hash = await this.idHash();
		
        const sql = 
            `INSERT INTO osoba (punoime, idosobe, motpismo, datumrod, email, brojtel)
             VALUES('${this.ime}', '${hash}', '${this.motivacijskoPismo}', '${this.datGodRodenja}', '${this.email}', '${this.brojTelefona}')`;
    
        await SQLutil.query(sql);
	}
	
	/**
     * Vraca sve prijave iz db
     */
    static async fetchAllApplications() {
        let results = await dbGetApplications();
        return this.fillArray(results);
    }

    /**
	 * Vraca prijave koje nisu potvrdene
	 * @param {boolean trazimo li animatore ili sudionike} isAnimator 
	 */
    static async fetchNotConfirmedApplications(isAnimator) {
        let results = await dbGetNotConfirmedApplications(isAnimator);
        return this.fillArray(results);
	}

	/**
     * Puni i vraća polje osoba koje sadrži rezultate dohvata iz db 
     * @param {Results from db} results 
     */
    static fillArray(results) {
        let applications = new Array();

        if (results.length > 0) {
            results.forEach(appl => {
                applications.push(new AnimatorISudionik(appl.punoime, appl.email,
                    appl.brojtel, appl.datumrod.toString().substring(3, 15), appl.motpismo, appl.idosobe));
            });
        }
        return applications
    }

};

async function dbGetApplications() {
    const sql = 'SELECT punoime, idosobe, motpismo, datumrod, email, brojtel, brojtelefonaodgosobe FROM osoba;';
    return SQLutil.query(sql);
};

async function dbGetNotConfirmedApplications(isAnimator) {
	const is = isAnimator ? "" : "NOT";
	const sql = `SELECT punoime, idosobe, motpismo, datumrod, email, brojtel, brojtelefonaodgosobe 
    FROM osoba WHERE idosobe NOT IN (SELECT idosobe FROM racun) AND idosobe ${is} IN (SELECT idanimatora FROM animator) AND idosobe NOT IN (SELECT idorganizatora FROM organizator);`;
    return SQLutil.query(sql);
};


   
