var db = require('../../db/db');

const register = {
    async createUser(customer_name, password, street, state, city) {
        // 新建用户
        let [customerResult, addressResult] = await Promise.all([
            db.query(`insert into customer (customer_name, password) values ('${customer_name}', ${password} )`),
            db.query(`insert into address (street, city, state) values ('${street}', '${city}', '${state}' )`)
        ]);

        // 查一下具体的customer_id和address_id
        let [customerIdResult, addressIdResult] = await Promise.all([
            db.query(`SELECT * FROM customer WHERE customer_name = '${customer_name}'`),
            db.query(`SELECT * FROM address WHERE street = '${street}' and state = '${state}' and city = '${city}'`),
        ])

        const customer_id = customerIdResult.rows[0].customer_id;
        const address_id = addressIdResult.rows[0].address_id;

        let addrResult = await db.query(`insert into customer_addr (customer_id, address_id) values ('${customer_id}', ${address_id} )`);

        return addrResult;
    },
    async checkUserAlreadyRegistered(userName) {
        // 检查用户是否已经注册
        const result = await db.query(`SELECT * FROM customer WHERE customer_name = '${userName}'`);

        return result.rows.length > 0;
    },
    async checkStaffAlreadyRegistered(fisrt_name, last_name, middle_name) {
        // 插件staff是否已经注册了
        try {
            const result = await db.query(`SELECT * FROM staff WHERE fisrt_name = '${fisrt_name}' and last_name = '${last_name}' and middle_name = '${middle_name}'`);
            return result.rows.length > 0;
        } catch (error) {
            console.log(error);
            return false
        }

    },
    async createStaff(fisrt_name, last_name, middle_name, salary, job_title, password, street, state, city) {
        // 新建用户
        // let [customerResult, addressResult] = await Promise.all([
        //     db.query(`insert into customer (fisrt_name, last_name, middle_name, salary, job_title, password) values ('${fisrt_name}', ${last_name}, ${middle_name}, ${salary}, ${job_title}, ${password} )`),
        //     db.query(`insert into address (street, city, state) values ('${street}', '${city}', '${state}' )`)
        // ]);
        try {
            let addressResult = await db.query(`insert into address (street, city, state) values ('${street}', '${city}', '${state}' )`);
        } catch (error) {
            console.log(error);
        }

        return addressResult;
    },
}

module.exports = register;