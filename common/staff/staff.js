/*
 * @Author: your name
 * @Date: 2020-12-01 17:49:03
 * @LastEditTime: 2020-12-01 18:11:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \node-cart\common\staff\staff.js
 */

var db = require('../../db/db'); 

const staff = {
    async getStaffInfo(staff_id) {
        
        try {
            let result = await db.query(`SELECT * FROM staff LEFT JOIN address ON staff.address_id = address.address_id WHERE staff_id = ${staff_id}`)

            return result.rows[0];
        } catch (error) {
            return null;
        }
    },
    async updateStaffInfo(staff_id, first_name, middle_name, last_name, street, state, city) {

        try {
             let [updateCustomer, addressItem] = await Promise.all([
                db.query(`update staff set first_name = '${first_name}', middle_name = '${middle_name}', last_name = '${last_name}' where staff_id = '${staff_id}'`),
                db.query(`select * from staff where staff_id = '${staff_id}'`)
            ])
            const address_id = addressItem.rows[0].address_id;

            let result = await db.query(`update address set state = '${state}', street = '${street}', city = '${city}' where address_id = '${address_id}'`);

            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = staff;