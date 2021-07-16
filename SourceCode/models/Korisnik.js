const SQLutil = require('./SQLutil');


//razred Korisnik enkapsulira korisnike web platforme kampa
//svaki korisnik je baziran na jednoj osobi
module.exports = class Korisnik{

    constructor(korisnickoIme, lozinka, hash) {
		this.korisnickoIme = korisnickoIme;
		this.lozinka = lozinka;
		this.hash = hash;
	}

	/**
	 * registrira korisnika u bazi
	 */
	async registracija() {
		let uloga = await this.isAnimator() ? 'a' : 's';
		const sql = `INSERT INTO racun (korisnickoime, lozinka, idosobe, vrracuna)
					VALUES('${this.korisnickoIme}', '${this.lozinka}', ${this.hash}, '${uloga}')`;

		SQLutil.query(sql);					
	}

	async promijeniLozinku() {
		const sql = `UPDATE racun
					SET lozinka = '${this.lozinka}'
					WHERE korisnickoime = '${this.korisnickoIme}'`
		
		SQLutil.query(sql);

		return this.prijava();
	}

	/**
	 * Provjerava je li ovaj korisnik animator ili sudionik
	 */
	async isAnimator() {
		const sql = `SELECT idAnimatora FROM animator WHERE idAnimatora = ${this.hash}`;
		let result = await SQLutil.query(sql);
	
		return result.length > 0;
	}
	
	//prijavi korisnika u bazi
	async prijava() {
		const sql = `SELECT vrracuna FROM racun WHERE korisnickoime = '${this.korisnickoIme}' AND lozinka = '${this.lozinka}'`;
		return await SQLutil.query(sql);
	} 

	static async nadiPrihvatljiviUsername(username) {
		let sql = `SELECT korisnickoime FROM racun where korisnickoime = '${username}'`;
		let result = await SQLutil.query(sql);

		let br = 1;
		let nusername = username;
		while(result.length > 0) {
			nusername = username + br++;
			sql = `SELECT korisnickoime FROM racun where korisnickoime = '${nusername}'`;
			result = await SQLutil.query(sql);
		}

		return nusername;
	}
}

   
