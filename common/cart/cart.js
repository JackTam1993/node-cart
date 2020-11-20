var db = require('../../db/db');
const customerInfo = require('../customerInfo/customerInfo');

const cart = {
    async addCart(customer_id, product_id, quantity) {

        try {
            let result = await db.query(`insert into shopping_cart (customer_id, product_id, quantity) values (${customer_id}, ${product_id}, ${quantity})`);
            
            return true;
        } catch (error) {
            return null;
        }
    },
    async delCart(customer_id, product_id) {

        try {
            let result = await db.query(`delete from shopping_cart where shopping_cart.customer_id = ${customer_id} and shopping_cart.product_id = ${product_id}`);

            return true;
        } catch (error) {
            return null
        }
    },
    async getCartList(customer_id) {

        try {
            let result = await db.query(`select* from shopping_cart where shopping_cart.customer_id = ${customer_id}`);

            return result.rows;
        } catch (err) {
            return null;
        }
    },
    async cartSubmit(customer_id, address_id) {

        try {
            // 获取用户地址和信用卡信息
            let [creditCard, address] = await Promise.all([
                db.query(`SELECT * FROM credit_card where address_id = '${address_id}' and customer_id = '${customer_id}'`),
                db.query(`SELECT * FROM customer_addr LEFT JOIN address ON customer_addr.address_id = address.address_id where customer_addr.customer_id = ${customer_id} AND customer_addr.address_id = ${address_id}`)
            ])
            const {street, city, state} = address.rows[0];
            const {credit_card_no} = creditCard.rows[0];
        } catch (error) {
            
        }
    }
}

module.exports = cart;