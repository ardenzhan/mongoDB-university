const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'crunchbase';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err);
  console.log('Successfully connected to MongoDB.');

  const db = client.db(dbName);

  let query = { "category_code": "biotech" };

  // Explicit Cursor
  findCompanyCursor(db, query, (cursor) => {
    console.log('\nEXPLICIT CURSOR\n');
    cursor.forEach(
      (company) => {
        console.log(company.name, 'is a', company.category_code, 'company.');
      },
      (err) => {
        assert.equal(err, null);
        client.close();
      }
    );
  });

  // Converting toArray
  findCompany(db, query, (companies) => {
    console.log('\nTO ARRAY\n');
    companies.forEach((company) => {
      console.log(company.name, 'is a', company.category_code, 'company.');
    });
    client.close();
  });

});

const findCompanyCursor = (db, query, callback) => {
  const collection = db.collection('companies');
  const cursor = collection.find(query);
  callback(cursor);
};

const findCompany = (db, query, callback) => {
  const collection = db.collection('companies');
  collection.find(query).toArray((err, companies) => {
    assert.equal(err, null);
    assert.notEqual(companies.length, 0);
    callback(companies);
  });
};
