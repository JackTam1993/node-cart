var express = require('express');
var router = express.Router();

var db = require('../db/db');

router.get('/', async function(req, res, next) {

    try {
        let result = await db.query('select * from address');

        res.json({
            code: 0,
            data: result
        })
    } catch(e) {
        res.statusCode(500);
    }
});

// 顾客注册接口
router.post('/register', async (req, res, next) => {

})

// 顾客登录接口
router.post('/login', async (req, res, next) => {

})

// 获取顾客信息接口
router.get('/customer-info', async (req, res, next) => {

})

// 更新顾客信息接口
router.post('/edit-customer-info', async (req, res, next) => {

})

// 更新顾客密码接口
router.post('/update-customer-password', async (req, res, next) => {

})

// 获取收件信息接口
router.get('/get-address-list', async (req, res, next) => {

})

// 获取新增收件信息接口
router.post('/create-address', async (req, res, next) => {

})

// 获取更新收件信息接口
router.post('/update-address', async (req, res, next) => {

})

module.exports = router;