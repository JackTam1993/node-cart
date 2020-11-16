var db = require('../../db/db');

const login = {
    async checkPassword(userName, password) {
        try {
            const result = await db.query(`SELECT * FROM customer WHERE customer_name = '${userName}'`);

            let user = result.rows.find(item => item.password == password);
            return user.customer_id;
        } catch (error) {
            console.log(error)
            return false;
        }
        
        
    }
}

module.exports = login;