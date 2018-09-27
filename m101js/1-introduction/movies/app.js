const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

const url = 'mongodb://localhost:27017';
const dbName = 'video';

const express = require('express');
const app = express();
const engines = require('consolidate');
const port = 3000;

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err);
  console.log('Connected successfully to MongoDB');

  const db = client.db(dbName);

  app.get('/', (req, res) => {
    findMovies(db, (data) => {
      res.render('movies', { 'movies': data });
    });
  });

  app.get('/add_movie', (req, res, next) => {
    res.render('add_movie', {});
  });

  app.post('/add_movie', (req, res, next) => {
    let title = req.body.title;
    let year = req.body.year;
    let imdb = req.body.imdb;

    if ((title == '') || (year == '') || (imdb == '')) {
      next('Please provide an entry for all fields');
    } else {
      db.collection('movies').insertOne(
        { "title": title, "year": year, "imdb": imdb },
        (err, doc) => {
          assert.equal(null, err);
          res.send("Document inserted with _id: " + doc.insertedId);
        }
      );
    }
  });

  app.get('/insert', (req, res) => {
    insertMovies(db, (data) => {
      res.send("Inserted 2 movies into the collection");
    });
  });

  app.get('/update', (req, res) => {
    updateMovie(db, (data) => {
      res.send("Updated movie with title Star Wars to Star Wars 2");
    });
  });

  app.get('/remove', (req, res) => {
    removeMovie(db, (data) => {
      res.send("Removed movie with title Pulp Fiction");
    });
  });

  // app.use((req, res) => res.sendStatus(404));
  app.use(errorHandler);

  app.listen(port, () => console.log(`Express listening on port ${port}`))
});

const insertMovies = (db, callback) => {
  const collection = db.collection('movies');
  collection.insertMany([
    { "title": "Star Wars" },
    { "title": "Pulp Fiction" }
  ], (err, result) => {
    assert.equal(err, null);
    assert.equal(2, result.result.n);
    assert.equal(2, result.ops.length);
    callback(result);
  });
}

const findMovies = (db, callback) => {
  const collection = db.collection('movies');
  collection.find({}).toArray((err, movies) => {
    assert.equal(err, null);
    callback(movies);
  });
}

const updateMovie = (db, callback) => {
  const collection = db.collection('movies');
  collection.updateOne(
    { "title": "Star Wars" },
    { $set: { "title": "Star Wars 2" } },
    (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      callback(result);
    }
  );
}

const removeMovie = (db, callback) => {
  const collection = db.collection('movies');
  collection.deleteOne({"title": "Pulp Fiction"},
    (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      callback(result);
    }
  );
}

const indexCollection = (db, callback) => {
  db.collection('movies').createIndex(
    { "title": 1 },
    null,
    (err, results) => {
      console.log("Created index", results);
      callback();
    }
  );
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.status(500).render('error_template', { error: err });
}
