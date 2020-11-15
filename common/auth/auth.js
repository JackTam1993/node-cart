const jwt = require('jsonwebtoken');
const secret = 'postgres';

const auth = {
    sign(payload) {
        const token = jwt.sign(payload, secret, {expiresIn: '2h'});
        return token;
    },
    verify(token) {
        let verifyResult = jwt.verify(token, secret);
        return verifyResult;
    }
}

module.exports = auth;