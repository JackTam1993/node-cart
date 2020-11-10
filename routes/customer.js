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

module.exports = router;