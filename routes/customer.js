var express = require('express');
var router = express.Router();

const login = require('../common/login/login');
const auth = require('../common/auth/auth');
const register = require('../common/register/register');
const customerInfo = require('../common/customerInfo/customerInfo');

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

// 顾客注册接口
router.post('/register', async (req, res, next) => {
    const {customer_name, password, street, state, city} = req.body;

    const checkUserAlreadyRegistered = await register.checkUserAlreadyRegistered(customer_name);
    if(checkUserAlreadyRegistered) {
        res.json({
            code: 1,
            data: '用户已注册'
        })
    } else {
        let result = await register.createUser(customer_name, password, street, state, city);
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

// 获取顾客信息接口
router.get('/customer-info', checkLogin, async (customer_id, req, res, next) => {

    let result = await customerInfo.getInfo(customer_id);

    res.json({
        code: result == null ? 1 : 0,
        data: result
    })

})

// 更新顾客信息接口
router.post('/edit-customer-info', async (req, res, next) => {

})

// 更新顾客密码接口
router.post('/update-customer-password', checkLogin, async (customer_name, req, res, next) => {

    const {password} = req.body;

    let result = await customerInfo.updatePassword(customer_name, password);

    res.json({
        code: 0,
        data: 'success'
    })

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