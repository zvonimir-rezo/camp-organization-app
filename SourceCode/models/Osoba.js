const SQLutil = require('./SQLutil');
const Grupa = require('./Grupa')

//razred Osoba enkapsulira ljudsku osobu 
module.exports = class Osoba {

    //konstruktor osobe
    constructor(ime, email, brojTelefona, datGodRodenja) {
        this.ime = ime;
        this.email = email;
        this.brojTelefona = brojTelefona;
        this.datGodRodenja = datGodRodenja;
    }


    

    /**
     * Briše iz db osobu sa zadanim id-om
     * @param {*} id 
     */
    static async removeById(id) {
        let sql = `DELETE FROM animator WHERE idanimatora = ${id}`
        SQLutil.query(sql);
    
        sql = `DELETE FROM osoba WHERE idosobe = ${id}`
        SQLutil.query(sql);
    }

    /**
     * Provjerava postoji li u bazi već registrirana osoba s poslanim emailom 
     * @param {email} email 
     */
    static async provjeriEmail(email) {
        const sql = `SELECT email FROM osoba WHERE email = '${email}'`;
        let results = await SQLutil.query(sql);

        return results.length > 0;
    }

    /**
     * Vraća sve osobe iz tablice osoba koje nisu animatori ili organizatori, tj. vraća sudionike
     */
    static async getAllConfirmed() {
        const sql = `SELECT * FROM osoba 
                    WHERE idosobe NOT IN (SELECT idorganizatora FROM organizator) 
                    AND idosobe NOT IN (SELECT idanimatora FROM animator)`;
        let result = await SQLutil.query(sql);
        return result;
    }

    static async getGroupByUsername(username, uloga) {
        if(uloga == 'a') return "";
        
        const sql = `SELECT nazivgrupa FROM sudionik
                    WHERE idosobe = (SELECT idosobe FROM racun
                    WHERE korisnickoime = '${username}')`;
        let result = await SQLutil.query(sql);
        return result[0].nazivgrupa;
    }

    /**
     * Razvrstava sudionike u grupe slučajnim odabirom -> metoda shuffle
     */
    static async razvrstajUGrupe() {
        let osobe = await Osoba.getAllConfirmed();
        let arr = new Array();
        let grupe = await Grupa.fetchAllGroups();
        while (arr.length < osobe.length) {
            for (let i = 1; i <= grupe.length; i++) {
                if (arr.length < osobe.length) { 
                    arr.push(i);
                } else {
                    break;
                }
            }
        }
        arr = shuffle(arr);
        for (let i = 0; i < osobe.length; i++) {
            let sql = "INSERT INTO sudionik (idosobe, nazivgrupa) VALUES(\'" + osobe[i].idosobe + "\', \'Grupa " + arr[i] + "\')";
            await SQLutil.query(sql);
        }
    }

    

    async idHash() {
        try {
            let hash = genHash(this.ime);
            return hash;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    
};

/**
 * Shuffla polje brojeva
 * @param {array} polje 
 */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

async function genHash(ime) {
    let hash = 0, i, chr;
    let name = String(ime);
    for(i = 0; i < name.length; i++)
    {
        chr = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}




