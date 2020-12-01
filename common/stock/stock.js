var db = require('../../db/db');

const stock = {
    async getAllStock() {
        // 获取全部商品
        try {
            let result = await db.query(`select * from stock`);

            return result.rows;
        } catch (error) {
            return null;
        }
    },
    async getStockByWarehouseId(warehouse_id) {
        // 获取某个仓库下的全部商品
        try {
            let result = await db.query(`select * from stock where warehouse_id = ${warehouse_id}`);

            return result.rows;
        } catch (error) {
            return null;
        }
    }
}

module.exports = stock;