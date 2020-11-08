const { Client } = require('pg')
const config = require('./config');

const client = new Client(config);

const db = {
    async query(sql) {
        client.connect()
        
        try {
            const res = await client.query(sql);
            await client.end()

            return res;
        } catch(e) {
            console.error(e)
            await client.end()
        }
    }
}

module.exports = db;