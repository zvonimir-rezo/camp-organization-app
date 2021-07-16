const SQLutil = require('./SQLutil');
const Aktivnost = require('./Aktivnost')
//aktivnosti na kojima sudjeluje samo jedna grupa
module.exports = class AktivnostSamoJednaGrupa extends Aktivnost {
    async persist() {
        super.persist();
        const sql = `INSERT INTO aktivnost1 VALUES('${this.ime}')`;
        SQLutil.query(sql);
    }

    
    static async odaberiAktivnostiZaSamoJednuGrupu(aktivnosti) {
        let akt = new Array();

        for(let aktivnost of aktivnosti) {
            let sql = `SELECT * FROM aktivnost1 WHERE nazivakt = '${aktivnost.ime}'`
            let result = await SQLutil.query(sql);
            
            if(result.length > 0) {
                akt.push(new AktivnostSamoJednaGrupa(aktivnost.ime, aktivnost.kratkiOpis, aktivnost.trajanje / 3600));
            }
        }

        return akt;
    }
}
