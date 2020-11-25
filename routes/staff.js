var express = require('express');
var router = express.Router();

const db = require('../db/db');
const login = require('../common/login/login');
const auth = require('../common/auth/auth');
const register = require('../common/register/register');
const { default: warehouse } = require('../common/warehouse/warehouse');

let checkLogin = (req, res, next) => {
    const {token} = req.headers;

    if(!token) {
        // 没有带token
        res.json({
            code: 1,
            data: '缺少token'
        })

        return;
    }

    // 验证用户登录信息
    let verifyResult = auth.verify(token);
    if(!verifyResult.customer_id) {
        res.json({
            code: 1,
            data: '用户未登录'
        })

        return;
    }
    next(verifyResult.customer_id);
}

// staff注册接口
router.post('/register', async (req, res, next) => {
    const {first_name, last_name, middle_name, salary, job_title, password, street, state, city} = req.body;

    const checkUserAlreadyRegistered = await register.checkStaffAlreadyRegistered(first_name, last_name, middle_name);
    if(checkUserAlreadyRegistered) {
        res.json({
            code: 1,
            data: '用户已注册'
        })
    } else {
        let result = await register.createStaff(first_name, last_name, middle_name, salary, job_title, password, street, state, city);
        console.log(result);

        res.json({
            code: 0,
            data: '注册成功'
        })
    }
})

// 顾客登录接口
router.post('/login', async (req, res, next) => {
    const {customer_name, password} = req.body;

    // 从数据库判断账号密码是否正确
    let customer_id = await login.checkPassword(customer_name, password);

    // 正确的话返回token，错误的话返回错误信息
    if(customer_id) {
        let token = auth.sign({
            customer_id
        });
    
        res.json({
            code: 0,
            data: token
        })
    } else {
        res.json({
            code: 1,
            data: 'no such a user'
        })
    }
    
})

// 获取仓库列表
router.get('/warehouse-list', checkLogin, (staff_id, req, res, next) => {
    try {
        let result = warehouse.getWarehouseList();

        res.json({
            code: 0,
            data: result
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 更新仓库信息
router.post('/warehouse-update', checkLogin, (staff_id, req, res, next) => {

    const {warehouse_id, warehouse_name, capacity, street, state, city} = req.body;
    try {
        let result = await warehouse.updateWarehouse(warehouse_id, warehouse_name, capacity, street, state, city)

        return res.json({
            code: 0,
            data: 'success'
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 删除仓库
router.post('/warehouse/delete', checkLogin, (staff_id, req, res, next) => {

    const {warehouse_id} = req.body;
    try {
        let result = await warehouse.deleteWarehouse(warehouse_id);

        return res.json({
            code: 0,
            data: 'success'
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

module.exports = router;