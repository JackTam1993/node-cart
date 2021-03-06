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
            let result = await db.query(`select * from shopping_cart left join product on shopping_cart.product_id = product.product_id right join product_price on shopping_cart.product_id = product_price.product_id where shopping_cart.customer_id = ${customer_id}`);

            return result.rows;
        } catch (err) {
            return null;
        }
    },
    async cartSubmit(customer_id, address_id) {

        try {
            // 获取用户地址和信用卡信息
            let [creditCard, address] = await Promise.all([
                db.query(`SELECT * FROM credit_card where customer_id = '${customer_id}'`),
                db.query(`SELECT * FROM customer_addr LEFT JOIN address ON customer_addr.address_id = address.address_id where customer_addr.customer_id = ${customer_id} AND customer_addr.address_id = ${address_id}`)
            ])
            const {street, city, state} = address.rows[0];
            const {credit_card_no} = creditCard.rows[0];

            let date = new Date()
            let order_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            let result = await db.query(`INSERT INTO "order" (order_date, status, customer_id, credit_card_no, street, city, state) values ('${order_date}', 'status', '${customer_id}', '${credit_card_no}', '${street}', '${city}', '${state}')`);

            // 获取新增的order_id;
            let max = await db.query(`select max(order_id) from "order"`);
            const order_id = max.rows[0].max;

            // 新增到order_item表
            let cartListDB = await db.query(`select * from shopping_cart where customer_id = ${customer_id}`)
            let cartList = cartListDB.rows;

            for(let i of cartList) {
                await db.query(`insert into order_item (order_id, product_id, quantity) values (${order_id}, ${i.product_id}, ${i.quantity})`);
                // product表减数量
                await db.query(`update product set amount = amount - ${i.quantity} where product_id = ${i.product_id}`)
            }

            // 删除原有购物车数据
            let deleteResult = await db.query(`DELETE from shopping_cart where customer_id = ${customer_id}`);

            return true
        } catch (error) {
            return null;
        }
    },
    async checkRemainAmount(customer_id) {
        // 检查用户购物车中所有商品是否够扣
        try {
            let result = await db.query(`select * from shopping_cart left join product on shopping_cart.product_id = product.product_id right join product_price on shopping_cart.product_id = product_price.product_id where shopping_cart.customer_id = ${customer_id}`);

            let {rows} = result
            let item = rows.filter(item => item.amount < item.quantity);
            
            return item;
        } catch (err) {
            return false;
        }
    }
}

module.exports = cart;