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
    },
    async getAddressList(customer_id) {
        try {
            let result = await db.query(`select * from address left join customer_addr on address.address_id = customer_addr.address_id where customer_id = '${customer_id}'`);
            return result.rows;
        } catch (error) {
            return null;
        }
    },
    async addAddress(customer_id, street, state, city) {
        try {
            let address = await db.query(`insert into address (street, city, state) values ('${street}', '${city}', '${state}' )`);
            let addressItem = await db.query(`select * from address where street = '${street}' and city = '${city}' and state = '${state}'`);
            let address_id = addressItem.rows[addressItem.rows.length - 1].address_id;
            await db.query(`insert into customer_addr (customer_id, address_id) values ('${customer_id}', '${address_id}' )`)

            return true;
        } catch (error) {
            return null
        }
    }
}

module.exports = customerInfo;