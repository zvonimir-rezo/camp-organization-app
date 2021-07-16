const SQLutil = require('./SQLutil');
module.exports = class Grupa {

    constructor(nazivGrupa) {
        this.naziv = nazivGrupa;
    }
    async persist()
    {
        try
        {
            dbNovaGrupa(this);
        }
        catch(err)
        {
            console.log("dbNovaGrupa error" + err);
            throw err;
        }
    }

    static async fetchAllGroups()
    {
        let results = await dbGetGroups();
        let groups = new Array();


        if(results.length > 0)
        {
            results.forEach(group => {
                groups.push(new Grupa(group.nazivgrupa));
            });
        }
        return groups.sort();
    }

}

dbNovaGrupa = async (grupa) => {
    const sql = 
        "INSERT INTO grupa (nazivgrupa) VALUES(\'" + grupa.naziv + "\')";
    await SQLutil.query(sql);
};

dbGetGroups = async () => {
    const sql = 'SELECT nazivgrupa FROM grupa;';
    let result = await SQLutil.query(sql);
    return result;
};
