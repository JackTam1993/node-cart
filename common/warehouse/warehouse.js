/*
 * @Author: your name
 * @Date: 2020-11-25 16:26:12
 * @LastEditTime: 2020-12-04 11:03:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \node-cart\common\warehouse\warehouse.js
 */
var db = require('../../db/db');

const warehouse = {
    async getWarehouseList() {
        // 获取仓库列表
        try {
            let result = await db.query(`SELECT * FROM warehouse LEFT JOIN address ON warehouse.address_id = address.address_id`);

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
            let result = await db.query(`delete from warehouse where warehouse_id = ${warehouse_id}`);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async addWarehouse(warehouse_name, capacity, street, state, city) {
        try {
            let address = await db.query(`insert into address (street, city, state) values ('${street}', '${city}', '${state}' )`);
            // 这个地方感觉会有问题，之后再看
            let addressItem = await db.query(`select * from address where street = '${street}' and city = '${city}' and state = '${state}'`);
            let address_id = addressItem.rows[addressItem.rows.length - 1].address_id;

            let result = await db.query(`insert into warehouse (warehouse_name, capacity, address_id) values ('${warehouse_name}', '${capacity}', '${address_id}' )`)

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = warehouse;