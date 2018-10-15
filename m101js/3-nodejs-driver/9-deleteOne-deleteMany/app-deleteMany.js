const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'crunchbase';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(err, null);
  console.log('Successfully connected to MongoDB.');

  const db = client.db(dbName);

  let query = {'permalink': {'$exists': true, '$ne': null}};
  let projection = {'permalink': 1, 'updated_at': 1};

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort({'permalink': 1})

  let markedForRemoval = [];

  let prev = { 'permalink': '', 'updated_at': '' };
  cursor.forEach(
    (doc) => {
      if ((doc.permalink == prev.permalink) && (doc.updated_at == prev.updated_at)){
        markedForRemoval.push(doc._id);
      }
      prev = doc;
    },
    (err) => {
      assert.equal(err, null);
      let filter = {'_id': {'$in': markedForRemoval}};

      db.collection('companies').deleteMany(filter, (err, res) => {
        console.log(res.result);
        console.log(markedForRemoval.length + ' documents removed.');

        client.close();
      });
    }
  );
});
