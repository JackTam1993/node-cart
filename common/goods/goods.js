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
    }
}

module.exports = goods;