const SQLutil = require('./SQLutil');
const Aktivnost = require('./Aktivnost')
//aktivnosti na kojima nužno sudjeluju sve grupe
module.exports = class AktivnostSveGrupe extends Aktivnost {
    async persist() {
        await super.persist();
        const sql = `INSERT INTO aktivnostsve VALUES('${this.ime}')`;
        SQLutil.query(sql);
    }

    static async odaberiAktivnostiZaSveGrupe(aktivnosti) {
        let aktSveGrupe = new Array();

        for(let aktivnost of aktivnosti) {
            let sql = `SELECT * FROM aktivnostsve WHERE nazivakt = '${aktivnost.ime}'`
            let result = await SQLutil.query(sql);
            
            if(result.length > 0) {
                aktSveGrupe.push(new AktivnostSveGrupe(aktivnost.ime, aktivnost.kratkiOpis, aktivnost.trajanje / 3600));
            }
        }

        return aktSveGrupe;
    } 
}
