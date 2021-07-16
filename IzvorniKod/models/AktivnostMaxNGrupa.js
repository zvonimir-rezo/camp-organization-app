const SQLutil = require("./SQLutil");
const Aktivnost = require('./Aktivnost')
//aktivnosti na kojima sudjeluje maksimalno N grupa
module.exports = class AktivnostMaxNGrupa extends Aktivnost {
    async persist() {
        super.persist();
        const sql = `INSERT INTO aktivnostmaxn VALUES('${this.ime}', '${this.brojGrupa}')`;
        SQLutil.query(sql);
    }

    
    static async odaberiAktivnostiZaMaxNGrupa(aktivnosti) {
        let akt = new Array();

        for(let aktivnost of aktivnosti) {
            let sql = `SELECT * FROM aktivnostmaxn WHERE nazivakt = '${aktivnost.ime}'`
            let result = await SQLutil.query(sql);
            
            if(result.length > 0) {
                akt.push(new AktivnostMaxNGrupa(aktivnost.ime, aktivnost.kratkiOpis, aktivnost.trajanje / 3600, result[0].brojgrupa));
            }
        }

        return akt;
    }
}
