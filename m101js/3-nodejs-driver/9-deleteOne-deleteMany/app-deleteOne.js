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

  let numToRemove = 0;

  let prev = { 'permalink': '', 'updated_at': '' };
  cursor.forEach(
    (doc) => {
      if ((doc.permalink == prev.permalink) && (doc.updated_at == prev.updated_at)) {
        console.log(doc.permalink);
        numToRemove = numToRemove + 1;

        let filter = {'_id': doc._id};

        db.collection('companies').deleteOne(filter, (err, res) => {
          assert.equal(err, null);
          console.log(res.result);
        });
      }
      prev = doc;
    },
    (err) => {
      assert.equal(err, null);
    }
  );
});
