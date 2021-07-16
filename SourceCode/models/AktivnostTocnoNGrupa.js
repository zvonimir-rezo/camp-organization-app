const SQLutil = require('./SQLutil');
const Aktivnost = require('./Aktivnost')
//aktivnosti na kojima sudjeluje tocno N grupa
module.exports = class AktivnostTocnoNGrupa extends Aktivnost {
    async persist() {
        super.persist();
        const sql = `INSERT INTO aktivnostn VALUES('${this.ime}', '${this.brojGrupa}')`;
        SQLutil.query(sql);
    }
    
    static async odaberiAktivnostiZaTocnoNGrupa(aktivnosti) {
        let akt = new Array();

        for(let aktivnost of aktivnosti) {
            let sql = `SELECT * FROM aktivnostn WHERE nazivakt = '${aktivnost.ime}'`
            let result = await SQLutil.query(sql);
            
            if(result.length > 0) {
                akt.push(new AktivnostTocnoNGrupa(aktivnost.ime, aktivnost.kratkiOpis, aktivnost.trajanje / 3600, result[0].brojgrupa));
            }
        }

        return akt;
    }
}
