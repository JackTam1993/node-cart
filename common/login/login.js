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
    },
    async checkStaffPassword(first_name, middle_name, last_name, password) {
        try {
            const result = await db.query(`SELECT * FROM staff WHERE first_name = '${first_name}' and middle_name = '${middle_name}' and last_name = '${last_name}'`);

            let user = result.rows.find(item => item.password == password);
            return user.staff_id;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}

module.exports = login;