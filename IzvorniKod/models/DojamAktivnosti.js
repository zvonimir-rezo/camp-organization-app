//razred DojamAktivnosti enkapsulira ocijenu kao numerički parameter i
//dojam pojedinog sudionika ili animatora kampa
const SQLutil = require('./SQLutil');
module.exports = class DojamAktivnosti{

    constructor(Idosobe, punoIme, nazivAkt, ocjena, komentar) {
        this.Idosobe = Idosobe;
        this.punoIme = punoIme;
		this.nazivAkt = nazivAkt;
		this.ocjena = ocjena;
		this.komentar = komentar;
	}

	async persist()
    {
        try{
            dbNewDojamAktivnosti(this);
        }
        catch(err)
        {
            console.log('err persisting dojam: ' + JSON.stringify(this));
            throw err;
        }
    }

    static async fetchAllDojmovi()
    {
        let results = await dbGetDojamAktivnosti();
        let dojmovi = new Array();



        if(results.length > 0)
        {
            results.forEach(async dojam => {
                let punoIme = await this.getPunoIme(dojam.idosobe);
                dojmovi.push(new DojamAktivnosti(dojam.idosobe, punoIme, dojam.nazivakt, dojam.ocjena, dojam.komentar));
            });
        }
       
        return dojmovi;
    } 

    static async filterDojmoviByOsoba(dojmovi, osoba)
    {
        
        const sql = "SELECT Idosobe FROM osoba WHERE LOWER(punoIme) LIKE LOWER('%" + osoba + "%')";
        let result = await SQLutil.query(sql);
        let filtered = new Array();
        if(dojmovi.length > 0)
        {
            dojmovi.forEach(dojam => {
                result.forEach(result => {
                    if (result.idosobe == dojam.Idosobe) {
                        filtered.push(new DojamAktivnosti(dojam.Idosobe, dojam.punoIme, dojam.nazivAkt, dojam.ocjena, dojam.komentar));
                    }
                })
            });
        }
        return filtered;
    } 

    static async filterDojmoviByGrupa(dojmovi, grupa)
    {

        const sql = "SELECT Idosobe FROM sudionik WHERE LOWER(nazivGrupa) LIKE LOWER('%" + grupa + "%')";
        let result = await SQLutil.query(sql);
        let filtered = new Array();
        if(dojmovi.length > 0)
        {
            dojmovi.forEach(dojam => {
                result.forEach(result => {
                    if (result.idosobe == dojam.Idosobe) {
                        filtered.push(new DojamAktivnosti(dojam.Idosobe, dojam.punoIme, dojam.nazivAkt, dojam.ocjena, dojam.komentar));
                    }
                })
            });
        }
        return filtered;
    } 

    static async filterDojmoviByAktivnost(dojmovi, aktivnost)
    {
        let filtered = new Array();
        if(dojmovi.length > 0)
        {
            dojmovi.forEach(dojam => {
                if (dojam.nazivAkt.includes(aktivnost)) {
                    filtered.push(new DojamAktivnosti(dojam.Idosobe, dojam.punoIme, dojam.nazivAkt, dojam.ocjena, dojam.komentar));
                }
                
            });
        }
        return filtered;
    } 


    static async getId(korisnickoIme)
    {
        const idOsobeSql = `SELECT Idosobe FROM racun WHERE korisnickoIme = '${korisnickoIme}'`;
        let osoba = await SQLutil.query(idOsobeSql);
	    return osoba[0].idosobe;
    }

    static async getPunoIme(Idosobe) {
        const idOsobeSql = `SELECT punoIme FROM osoba WHERE Idosobe = ${Idosobe}`;
        let osoba = await SQLutil.query(idOsobeSql);
	    return osoba[0].punoime;
    }

}

dbGetDojamAktivnosti = async () => {
    const sql = 'SELECT * FROM dojamAktivnosti ORDER BY nazivAkt';
    let result = SQLutil.query(sql);
    return result;
};

dbNewDojamAktivnosti = async (dojam) => {
    const sql =
       "INSERT INTO dojamAktivnosti (Idosobe, nazivAkt, ocjena, komentar) VALUES(\'" + dojam.idOsobe + "\', \'" + dojam.nazivAkt + "\', \'" + dojam.ocjena  + "\', \'" + dojam.komentar + "\')";
    SQLutil.query(sql);
};

   
