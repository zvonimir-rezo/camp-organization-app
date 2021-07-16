const db = require('../db');

module.exports = class SQLutil {
    
    /**
     * Izvodi sql upit 
     * @param {*} sql 
     */
    static async query(sql) {
        try{
            const result = await db.query(sql, []);
            return result.rows;
        } catch(err) {
            console.log(`Sql query error with this sql:\n${sql}`);
            throw err;  
        }
    }

    
}