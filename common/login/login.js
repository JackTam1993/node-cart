var db = require('../../db/db');

const login = {
    async checkPassword(userName, password) {
        try {
            const result = await db.query(`SELECT * FROM customer WHERE customer_name = '${userName}'`);

            let userIndex = result.rows.findIndex(item => item.password == password);
            return userIndex >= 0;
        } catch (error) {
            console.log(error)
            return false;
        }
        
        
    }
}

module.exports = login;