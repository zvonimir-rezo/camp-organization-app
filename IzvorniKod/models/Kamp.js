const SQLutil = require("./SQLutil");

//razred kamp enkapsulira kamp 
module.exports = class Kamp{

    constructor(vrijemeOdrzavanja, trajanje, aktivnosti) {
		this.vrijemeOdrzavanja = vrijemeOdrzavanja;
		this.trajanje = trajanje * 3600 * 24;
		this.aktivnosti = aktivnosti;
	}

	async persist() {
		const sql = `INSERT INTO kamp VALUES('${this.vrijemeOdrzavanja}', '${this.trajanje}')`;
		SQLutil.query(sql);
	}

	static async poceoKamp() {
		const sql = `select * from kamp where current_timestamp >= vrijeme_pocetka`;
		return (await SQLutil.query(sql)).length != 0;

	}

	/**
	 * Provjerava u bazi ima li planova za kamp
	 */
	static async provjeriImaLiKampa() {
		const sql = `SELECT * FROM kamp`;
		let result = await SQLutil.query(sql);

		if(result.length == 0) return {pocetak: undefined, trajanje: undefined}

		return {
			pocetak: String(result[0].vrijeme_pocetka).slice(0, 24),
			trajanje: Number(result[0].trajanje.hours) / 24
		};
	}

	static async kampGotov() {
		const sql = `select * from kamp where current_timestamp < vrijeme_pocetka + trajanje`;
		return (await SQLutil.query(sql)).length == 0;
	}

	/**
	 * Otkazuje kamp
	 */
	static async otkaziKamp() {
		const sql = `DELETE FROM kamp;
					DELETE FROM prijava;
					DELETE FROM sudionik;
					DELETE FROM racun where vrracuna <> 'o' ;
					DELETE FROM animatorsudjeluje;
					DELETE FROM sudjeluje;
					DELETE FROM dojam;
					DELETE FROM dojamaktivnosti;
					DELETE FROM aktivnost1;
					DELETE FROM aktivnostn;
					DELETE FROM aktivnostmaxn;
					DELETE FROM aktivnostsve;
					DELETE FROM aktivnost;
					DELETE FROM grupa;
					DELETE FROM animator;
					DELETE FROM osoba WHERE idosobe NOT IN (SELECT idorganizatora FROM organizator);`
					;

		await SQLutil.query(sql);
	}

}


   
