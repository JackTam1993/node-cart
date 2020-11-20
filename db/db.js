const { Client, Pool } = require('pg')
const config = require('./config');

const pool = new Pool(config);

const db = {
    query(sql) {
        return new Promise((resolve, reject) => {
            pool.connect(function(err, client, done) {
                if(err) {
                  return console.error('connexion error', err);
                }
                client.query(sql, function(err, result) {
                  // call `done()` to release the client back to the pool
                  done();
              
                  if(err) {
                    reject(err)
                  }
                  resolve(result);
                });
            });
        })
    }
}

module.exports = db;