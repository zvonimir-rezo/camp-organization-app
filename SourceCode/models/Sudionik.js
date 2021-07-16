const SQLutil = require('./SQLutil')

//razred sudionik enkapsulira sudionike kampa
module.exports = class Sudionik {

    constructor(id, nazivGrupa) {
        this.id = id;
        this.nazivGrupa = nazivGrupa;
    }

    /**
     * Dodaje ovog sudionika u db u tablicu Sudionik
     */
    async addToDb() {
        console.log("tu sam");
        const sql = `INSERT INTO sudionik (idosobe, nazivgrupa) VALUES('${this.id}', '${this.nazivGrupa}');`;
        await SQLutil.query(sql);
    }

    /**
     * Briše iz tablice sudionik sudionika sa zadanim id-om
     * @param {*} id 
     */
    static async removeById(id) {
        let sql = `DELETE FROM sudionik WHERE idosobe = '${id}';`;
        SQLutil.query(sql);
    }

    static async fetchAllParticipants()
    {
        let results = await dbGetParticipants();
        let participants = new Array();

        if(results.length > 0)
        {
            results.forEach(p => {
                participants.push(new Sudionik(p.idosobe, p.nazivgrupa));
            });
        }
        return participants;
    }

}; 

dbGetParticipants = async () => {
    const sql = 'SELECT * FROM sudionik;';
    let result = await SQLutil.query(sql);
    return result;
};
