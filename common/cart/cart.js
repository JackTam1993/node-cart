var db = require('../../db/db');

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
    }
}

module.exports = cart;