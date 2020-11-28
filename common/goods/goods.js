var db = require('../../db/db');

const goods = {
    async getItemList() {
        try {
            let result = await db.query('select * from category');

            return result.rows;
        } catch (error) {
            return null;
        }
    },
    async getItemListByCategory(category_id) {
        try {
            let result = await db.query(`select * from product where category_id = '${category_id}'`);

            return result.rows;
        } catch (error) {
            return null;
        }
    },
    async getItemDetail(product_id) {
        try {
            let result = await db.query(`SELECT * FROM product LEFT JOIN product_detail ON product.product_id = product_detail.product_id WHERE product.product_id = ${product_id}`);

            return result.rows[0];
        } catch (error) {
            return null
        }
    },
    async getItemListByKeyword(keyword) {
        try {
            let result = await db.query(`select * from product where product_name like '%${keyword}%'`);

            return result.rows;
        } catch (error) {
            return null
        }
    }
}

module.exports = goods;