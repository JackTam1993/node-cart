var db = require('../../db/db');

const stock = {
    async getAllStock() {
        // 获取全部商品
        try {
            let result = await db.query(`select * from stock s LEFT JOIN warehouse w ON s.warehouse_id = w.warehouse_id RIGHT JOIN product p ON s.product_id = p.product_id WHERE s.product_id IS not NULL`);

            return result.rows;
        } catch (error) {
            return null;
        }
    },
    async getStockByWarehouseId(warehouse_id) {
        // 获取某个仓库下的全部商品
        try {
            let result = await db.query(`select * from stock s LEFT JOIN warehouse w ON s.warehouse_id = w.warehouse_id RIGHT JOIN product p ON s.product_id = p.product_id WHERE s.product_id IS not NULL and warehouse_id = ${warehouse_id}`);

            return result.rows;
        } catch (error) {
            return null;
        }
    }
}

module.exports = stock;