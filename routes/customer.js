var express = require('express');
var router = express.Router();

const login = require('../common/login/login');
const auth = require('../common/auth/auth');
const register = require('../common/register/register');
const customerInfo = require('../common/customerInfo/customerInfo');
const goods = require('../common/goods/goods');
const cart = require('../common/cart/cart');

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

    try {
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
    } catch (error) {
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
router.post('/edit-customer-info', checkLogin, async (customer_id, req, res, next) => {

    const {customer_name, street, state, city} = req.body;

    try {
        let result = await customerInfo.updateCustomerInfo(customer_id, customer_name, street, state, city);

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

// 更新顾客密码接口
router.post('/update-customer-password', checkLogin, async (customer_id, req, res, next) => {

    const {password} = req.body;

    let result = await customerInfo.updatePassword(customer_id, password);

    res.json({
        code: 0,
        data: 'success'
    })

})

// 获取收件信息接口
router.get('/get-address-list', checkLogin, async (customer_id, req, res, next) => {

    try {
        let result = await customerInfo.getAddressList(customer_id);

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

// 获取新增收件信息接口
router.post('/create-address', checkLogin, async (customer_id, req, res, next) => {

    const {street, state, city} = req.body;

    try {
        let result = await customerInfo.addAddress(customer_id, street, state, city);

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

// 获取更新收件信息接口
router.post('/update-address', checkLogin,  async (customer_id, req, res, next) => {

    const {street, state, city, address_id} = req.body;

    try {
        let result = await customerInfo.updateAddress(customer_id, street, state, city, address_id);

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

// 获取分类列表
router.get('/goods/category', async (req, res, next) => {

    try {
        let data = await goods.getItemList();

        res.json({
            code: 0,
            data
        })
    } catch (err) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 根据分类id获取分类下所有商品
router.get('/goods/list', async (req, res, next) => {

    const { category_id } = req.query;

    try {
        let data = await goods.getItemListByCategory(category_id);

        res.json({
            code: 0,
            data
        })
    } catch (err) {
        res.json({
            code: 1,
            data: null
        })
    }
})

// 搜索商品
router.get('/goods/search', async (req, res, next) => {
    const {keyword} = req.query;

    try {
        let data = await goods.getItemListByKeyword(keyword);

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

// 获取商品信息
router.get('/goods/detail', async (req, res, next) => {

    const {product_id} = req.query;

    try {
        let data = await goods.getItemDetail(product_id);

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

// 添加商品到购物车
router.post('/cart/add', checkLogin, async (customer_id, req, res, next) => {

    const {product_id, quantity} = req.body;

    try {
        let result = await cart.addCart(customer_id, product_id, quantity);

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

// 从购物车删除商品
router.post('/cart/del', checkLogin, async (customer_id, req, res, next) => {

    const {product_id} = req.body;

    try {
        let result = await cart.delCart(customer_id, product_id);

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

// 从购物车删除商品
router.get('/cart/list', checkLogin, async (customer_id, req, res, next) => {

    try {
        let data = await cart.getCartList(customer_id);

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

router.post('/cart/submit', checkLogin, async (customer_id, req, res, next) => {

    const {address_id} = req.body;

    try {
        // submit前检查一下仓库余额够不够
        let remain = await cart.checkRemainAmount(customer_id);

        if(remain.length > 0) {
            // 告诉前端哪些扣不了

            let productNameArr = remain.map(item => item.product_id)
            res.json({
                code: 1,
                msg: '商品数量不足',
                data: productNameArr
            })
        } else {
            let data = await cart.cartSubmit(customer_id, address_id);

            res.json({
                code: 0,
                data: 'success'
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