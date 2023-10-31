const { MongoClient, Db } = require("mongodb");

let client = null;

async function connect(url, callback) {
  if (client === null) {
    client = new MongoClient(url);
    try {
        await  client.connect();
        callback();
    } catch (error) {
              client = null;
              callback(err);
     
          }
    }
   else {
    callback();
  }
}

function db() {
  var db = new Db(client, process.env.DB_NAME);
  return db;
}

function fermer() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { connect,  db, fermer };