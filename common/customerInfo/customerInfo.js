var db = require('../../db/db');

const customerInfo = {
    async getInfo(customer_name) {
        let result = await db.query(`select * from customer left join customer_addr on customer.customer_id = customer_addr.customer_id right join address on customer_addr.address_id = address.address_id where customer_name = '${customer_name}'`);

        let data = result.rows.length == 0 ? null : result.rows[0];
        return data;
    },
    async updatePassword(customer_name, password) {
        let result = await db.query(`update customer set password = '${password}' where customer_name = '${customer_name}'`);

        return true;
    }
}

module.exports = customerInfo;