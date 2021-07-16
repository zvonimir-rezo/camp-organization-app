const SQLutil = require('./SQLutil');
const DojamAktivnosti = require('./DojamAktivnosti');
module.exports = class UkupanDojam{

    constructor(idOsobe, ocjena, komentar) {
		this.idOsobe = idOsobe;
		this.ocjena = ocjena;
		this.komentar = komentar;
	}

	async persist()
    {
        try{
            dbNewUkupanDojam(this);
        }
        catch(err)
        {
            console.log('err persisting application: ' + JSON.stringify(this));
            throw err;
        }
    }

    static async checkIfDojamEntered(korisnickoIme) {
        let id = await DojamAktivnosti.getId(korisnickoIme);
        const idOsobeSql = `SELECT Idosobe FROM dojam WHERE Idosobe = '${id}'`;
        let dojam = await SQLutil.query(idOsobeSql);

        return dojam.length > 0;
    }

}

dbGetUkupanDojam = async () => {
    const sql = 'SELECT * FROM dojam';
    let result = SQLutil.query(sql);
    return result;
};

dbNewUkupanDojam = async (dojam) => {
    const sql =
       "INSERT INTO dojam (Idosobe, ocjena, komentar) VALUES(\'" + dojam.idOsobe + "\', \'"  + dojam.ocjena  + "\', \'" + dojam.komentar + "\')";
    SQLutil.query(sql);
};