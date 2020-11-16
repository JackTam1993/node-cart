var db = require('../../db/db');

const customerInfo = {
    async getInfo(customer_id) {
        try {
            let result = await db.query(`select * from customer left join customer_addr on customer.customer_id = customer_addr.customer_id right join address on customer_addr.address_id = address.address_id where customer.customer_id = '${customer_id}'`);

            let data = result.rows.length == 0 ? null : result.rows[0];
            return data;
        } catch(err) {
            return null
        }
        
    },
    async updatePassword(customer_id, password) {
        let result = await db.query(`update customer set password = '${password}' where customer_id = '${customer_id}'`);

        return true;
    },
    async updateCustomerInfo(customer_id, customer_name, street, state, city) {
        try {
            let [updateCustomer, updateAddress] = await Promise.all([
                db.query(`update customer set customer_name = '${customer_name}' where customer_id = '${customer_id}'`),
                db.query(`update address set state = '${state}', street = '${street}', city = '${city}' from customer_addr where address.address_id = customer_addr.address_id and customer_addr.customer_id = '${customer_id}'`)
            ])
            return true;
        } catch (error) {
            console.log(error)
            return null;
        }
        


    }
}

module.exports = customerInfo;