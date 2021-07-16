const SQLutil = require("./SQLutil");
const AnimatorISudionik = require('./AnimatorISudionik');

//razred sudionik enkapsulira sudionike kampa mlade od 18 godina
module.exports = class SudionikMladiOd18 extends AnimatorISudionik{
	constructor(ime, email, brojTelefona, datGodRodenja, motivacijskoPismo, brojTelefonaOdgOsobe) {
		super(ime, email, brojTelefona, datGodRodenja, motivacijskoPismo);
		this.brojTelefonaOdgOsobe = brojTelefonaOdgOsobe;
	}

	async persist() {
        let hash = await this.idHash();
        
        const sql = 
            `INSERT INTO osoba (punoime, email, idosobe, motpismo, datumrod, brojtel, brojtelefonaodgosobe)
             VALUES('${this.ime}', '${this.email}', '${hash}', '${this.motivacijskoPismo}', '${this.datGodRodenja}', '${this.brojTelefona}', '${this.brojTelefonaOdgOsobe}')`;
    
        SQLutil.query(sql);
    }

}

   
