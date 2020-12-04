var express = require('express');
var router = express.Router();

const db = require('../db/db');
const login = require('../common/login/login');
const auth = require('../common/auth/auth');
const register = require('../common/register/register');
const warehouse = require('../common/warehouse/warehouse');
const staff = require('../common/staff/staff');
const stock = require('../common/stock/stock');
const goods = require('../common/goods/goods');

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
    if(!verifyResult.staff_id) {
        res.json({
            code: 1,
            data: '用户未登录'
        })

        return;
    }
    next(verifyResult.staff_id);
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

// staff登录接口
router.post('/login', async (req, res, next) => {
    const {first_name, middle_name, last_name, password} = req.body;

    // 从数据库判断账号密码是否正确
    let staff_id = await login.checkStaffPassword(first_name, middle_name, last_name, password);

    // 正确的话返回token，错误的话返回错误信息
    if(staff_id) {
        let token = auth.sign({
            staff_id
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

// 获取staff信息接口
router.get('/staff-info', checkLogin, async (staff_id, req, res, next) => {

    try {
        let data = await staff.getStaffInfo(staff_id);

        res.json({
            code: 0,
            data
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 更新staff信息接口
router.post('/edit-staff-info', checkLogin, async (staff_id, req, res, next) => {

    const {first_name, middle_name, last_name, street, state, city} = req.body;

    try {
        let result = await staff.updateStaffInfo(staff_id, first_name, middle_name, last_name, street, state, city);

        res.json({
            code: 0,
            data: 'success'
        })
    } catch (error) {
        res.json({
            code: 0,
            data: 'error'
        })
    }
    
})

// 获取仓库列表
router.get('/warehouse-list', checkLogin, async (staff_id, req, res, next) => {
    try {
        let result = await warehouse.getWarehouseList();

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

// 增加仓库
router.post('/warehouse-add', checkLogin, async (staff_id, req, res, next) => {

    const {warehouse_name, capacity, street, state, city} = req.body;

    try {
        let result = await warehouse.addWarehouse(warehouse_name, capacity, street, state, city);

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

// 更新仓库信息
router.post('/warehouse-update', checkLogin, async (staff_id, req, res, next) => {

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
router.post('/warehouse/delete', checkLogin, async (staff_id, req, res, next) => {

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

// 获取所有商品
router.get('/stock', async (req, res, next) => {

    try {
        let data = await stock.getAllStock();

        return res.json({
            code: 0,
            data
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 根据warehouse_id获取商品
router.get('/stock-by-warehouseid', async (req, res, next) => {

    const {warehouse_id} = req.query;

    try {
        let data = await stock.getStockByWarehouseId(warehouse_id);

        return res.json({
            code: 0,
            data
        })
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 新增商品
router.post('/goods/add', checkLogin, async (staff_id, req, res, next) => {

    const {product_name, amount, category_id, size, type, content, state, price} = req.body;

    try {
        let result = await goods.addItem(product_name, amount, category_id, size, type, content, state, price);

        res.json({
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

// 修改商品
router.post('/goods/edit', checkLogin, async (staff_id, req, res, next) => {

    const {product_name, amount, category_id, size, type, content, state, price, product_id} = req.body;

    try {
        let result = await goods.editItem(product_name, amount, category_id, size, type, content, state, price, product_id);

        res.json({
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

// 删除商品
router.post('/goods/delete', checkLogin, async (staff_id, req, res, next) => {
    const {product_id} = req.body;

    try {
        let result = await goods.deleteItem(product_id);

        if(result) {
            res.json({
                code: 0,
                data: 'success'
            })
        } else {
            res.json({
                code: 1,
                data: '删除失败，其他订单中存在该商品'
            })
        }
    } catch (error) {
        res.json({
            code: 1,
            data: null
        })
    }
})

module.exports = router;