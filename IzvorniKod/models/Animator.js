const SQLutil = require("./SQLutil");
const AnimatorISudionik = require('./AnimatorISudionik');

//razred Animator enkapsulira animatora na kampu
module.exports = class Animator extends AnimatorISudionik{

    /**
     * Dodaje ovog animatora u db u tablicu Animator
     * @param {Number} id 
     */
    async addToDb(id) {
        const sql = `INSERT INTO animator (idanimatora) VALUES(${id})`;
        SQLutil.query(sql);
    }
    
    static async fetchAnimatorIDs()
    {
        let results = await dbGetAnimatorIDs();
        let animatorIDs = new Array();

        if(results.length > 0)
        {
            results.forEach(animator => 
                {
                    animatorIDs.push(animator.idanimatora);
                });
        }
        return animatorIDs;
    }

    static async fetchAnimatorNames() {
        const sql = 'SELECT punoime, idosobe FROM osoba WHERE idosobe IN (SELECT idanimatora FROM animator)';
        let results = await SQLutil.query(sql);

        let animatorNames = new Array();
        results.forEach(a => animatorNames.push({ime: a.punoime, hash : a.idosobe}));

        return animatorNames;

    }

    static async dohvatiAnimatore(username) {
        const sql = `SELECT punoime, email, brojtel FROM osoba NATURAL JOIN RACUN
        WHERE idosobe IN (SELECT idanimatora FROM animator) AND korisnickoime <> '${username}'`;
        return await SQLutil.query(sql);
    }
}

dbGetAnimatorIDs = async () => {
    const sql = 'SELECT idanimatora FROM animator;';
    let result = await SQLutil.query(sql);
    return result;
};




   
