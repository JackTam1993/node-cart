const { query } = require('../../db/db');
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
            let result = await db.query(`SELECT * FROM product LEFT JOIN product_detail ON product.product_id = product_detail.product_id right join product_price on product.product_id = product_price.product_id WHERE product.product_id = ${product_id}`);

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
    },
    async addItem(product_name, amount, category_id, size, type, content, state, price) {
        try {
            let result = db.query(`insert into product (product_name, amount, category_id, size) values ('${product_name}', '${amount}', '${category_id}', '${size}')`);

            // 获取最新的product_id
            let max = await db.query(`select max(product_id) from product`);
            const product_id = max.rows[0].max;

            await Promise.all([
                db.query(`insert into product_detail (product_id, content, type) values ('${product_id}', '${content}', '${type}')`),
                db.query(`insert into product_detail (product_id, state, price) values ('${product_id}', '${state}', '${price}')`)
            ])

            return true;
        } catch (error) {
            return false;
        }
    },
    async editItem(product_name, amount, category_id, size, type, content, state, price, product_id) {
        try {
            await Promise.all([
                db.query(`update product set product_name = '${product_name}', amount = '${amount}', category_id = '${category_id}', size = '${size}' where product_id = ${product_id}`),
                db.query(`update product_detail set product_id = '${product_id}', content = '${content}', type = '${type}' where product_id = ${product_id}`),
                db.query(`update product_detail set state = '${state}', content = '${price}', type = '${price}' where product_id = ${product_id}`)
            ])

            return true;
        } catch (error) {
            return false;
        }
    },
    async deleteItem(product_id) {
        try {
            let result = await db.query(`delete from product where product_id = ${product_id}`);

            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = goods;