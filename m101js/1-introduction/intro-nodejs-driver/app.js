const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'video';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertMovies(db, function() {
    indexCollection(db, function() {
      updateMovie(db, function() {
        removeMovie(db, function() {
          client.close();
        });
      });
    });
  });
});

const insertMovies = function(db, callback) {
  const collection = db.collection('movies');
  collection.insertMany([
    {"title": "Star Wars"},
    {"title": "Pulp Fiction"}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(2, result.result.n);
    assert.equal(2, result.ops.length);
    console.log("Inserted 2 movies into the collection");
    callback(result);
  });
}

const findMovies = function(db, callback) {
  const collection = db.collection('movies');
  collection.find({}).toArray(function(err, movies) {
    assert.equal(err, null);
    console.log("Found the following movies");
    console.log(movies);
    callback(movies);
  });
}

const updateMovie = function(db, callback) {
  const collection = db.collection('movies');

  collection.updateOne({ "title": "Star Wars" }
    , { $set: { "title": "Star Wars 2" } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the movie with the title Star Wars");
    callback(result);
  });
}

const removeMovie = function(db, callback) {
  const collection = db.collection('movies');

  collection.deleteOne({"title": "Pulp Fiction"}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the movie with the title Pulp Fiction");
    callback(result);
  });
}

const indexCollection = function(db, callback) {
  db.collection('movies').createIndex(
    { "title": 1 },
    null,
    function(err, results) {
      console.log("Created index", results);
      callback();
    }
  );
};
