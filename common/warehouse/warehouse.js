/*
 * @Author: your name
 * @Date: 2020-11-25 16:26:12
 * @LastEditTime: 2020-12-01 11:53:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \node-cart\common\warehouse\warehouse.js
 */
var db = require('../../db/db');

const warehouse = {
    async getWarehouseList() {
        // 获取仓库列表
        try {
            let result = await db.query(`SELECT * FROM warehouse`);

            return result.rows;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async updateWarehouse(warehouse_id, warehouse_name, capacity, street, state, city) {
        // 更新仓库信息
        try {
            // 获取address_id
            let warehouseRowData = await db.query(`SELECT * FROM warehouse where warehouse_id = ${warehouse_id}`);
            let address_id = warehouseRowData.rows[0].address_id;

            let [warehouseResult, addressResult] = await Promise.all([
                db.query(`update warehouse set warehouse_name = '${warehouse_name}', capacity = '${capacity}' where warehouse_id = ${warehouse_id}`),
                db.query(`update address set street = '${street}', state = '${state}', city = '${city}' where address_id = ${address_id}`)
            ])

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async deleteWarehouse(warehouse_id) {
        // 删除仓库
        try {
            let result = await db.query(`delete * from warehouse where warehouse_id = ${warehouse_id}`);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = warehouse;