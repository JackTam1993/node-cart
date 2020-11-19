var db = require('../../db/db');

const goods = {
    async getItemList() {
        try {
            let result = await db.query('select * from category');

            return result.rows;
        } catch (error) {
            
        }
    }
}

module.exports = goods;