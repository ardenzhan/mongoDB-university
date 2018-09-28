const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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

  app.get('/add-movie', (req, res, next) => {
    res.render('add-movie', {});
  });

  app.post('/add-movie', (req, res, next) => {
    let movie = {
      title: req.body.title,
      year: req.body.year,
      imdb: req.body.imdb
    };

    if ((movie.title == '') || (movie.year == '') || (movie.imdb == '')) {
      next('Please provide an entry for all fields');
    } else {
      addMovie(db, movie, (doc) => {
        res.redirect('/');
      });
    }
  });

  app.get('/:imdb', (req, res, next) => {
    findMovie(db, req.params.imdb, (movie) => {
      res.render('show-movie', { movie: movie });
    });
  });

  app.get('/:name', (req, res, next) => {
    let name = req.params.name;
    let getvar1 = req.query.getvar1;
    let getvar2 = req.query.getvar2;
    res.render('hello', { name: name, getvar1: getvar1, getvar2: getvar2 });
  });

  app.post('/edit-movie/:id', (req, res, next) => {
    let movie = {
      title: req.body.title,
      year: req.body.year,
      imdb: req.body.imdb,
      id: req.params.id
    }
    updateMovie(db, movie, (data) => {
      res.redirect('/');
    });
  });

  app.post('/delete-movie/:id', (req, res, next) => {
    removeMovie(db, req.params.id, (data) => {
      res.redirect('/');
    });
  });

  app.use(errorHandler);

  app.listen(port, () => console.log(`Express listening on port ${port}`))
});

const addMovie = (db, movie, callback) => {
  const collection = db.collection('movies');
  collection.insertOne(
    { "title": movie.title, "year": movie.year, "imdb": movie.imdb },
    (err, doc) => {
      assert.equal(null, err);
      callback(doc);
    }
  );
};

const findMovie = (db, imdb, callback) => {
  const collection = db.collection('movies');
  collection.findOne({ "imdb": imdb }, null,
    (err, movie) => {
      assert.equal(err, null);
      callback(movie);
    }
  );
};

const findMovies = (db, callback) => {
  const collection = db.collection('movies');
  collection.find({}).toArray((err, movies) => {
    assert.equal(err, null);
    callback(movies);
  });
}

const updateMovie = (db, movie, callback) => {
  const collection = db.collection('movies');
  collection.updateOne(
    { "_id": new ObjectId(movie.id) },
    { $set: {
      "title": movie.title,
      "year": movie.year,
      "imdb": movie.imdb
    } },
    null,
    (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      callback(result);
    }
  );
}

const removeMovie = (db, id, callback) => {
  const collection = db.collection('movies');
  collection.deleteOne({ "_id": new ObjectId(id) }, null,
    (err, doc) => {
      assert.equal(err, null);
      assert.equal(1, doc.result.n);
      callback(doc);
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
  res.status(500).render('error-template', { error: err });
}
