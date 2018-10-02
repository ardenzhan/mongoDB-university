const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'crunchbase';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err);
  console.log('Successfully connected to MongoDB.');

  const db = client.db(dbName);

  let query = { "category_code": "biotech" };

  findCompanyCursor(db, query, (cursor) => {
    let projection = { "name": 1, "category_code": 1, "_id": 0 };
    cursor.project(projection);

    cursor.forEach(
      (company) => {
        console.log(company.name, 'is a', company.category_code, 'company.');
        console.log(company);
      },
      (err) => {
        assert.equal(err, null);
        client.close();
      }
    );
  });
});

const findCompanyCursor = (db, query, callback) => {
  const collection = db.collection('companies');
  const cursor = collection.find(query);
  callback(cursor);
};
