var express = require('express');
var router = express.Router();

const login = require('../common/login/login');
const auth = require('../common/auth/auth');

// 顾客注册接口
router.post('/register', async (req, res, next) => {

})

// 顾客登录接口
router.post('/login', async (req, res, next) => {
    const {userName, password} = req.body;

    // 从数据库判断账号密码是否正确
    let result = await login.checkPassword(userName, password);

    // 正确的话返回token，错误的话返回错误信息
    let token = auth.sign({
        userName
    });

    res.json({
        code: 0,
        data: token
    })
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