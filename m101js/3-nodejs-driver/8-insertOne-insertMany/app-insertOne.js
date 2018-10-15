const MongoClient = require('mongodb').MongoClient;
const Twitter = require('twitter');
const assert = require('assert');

require('dotenv').load();

const TwitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const url = 'mongodb://localhost:27017';
const dbName = 'social';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err);
  console.log('Successfully connected to MongoDB.');

  const db = client.db(dbName);

  TwitterClient.stream('statuses/filter', { track: 'marvel' }, (stream) => {
    stream.on('data', (status) => {
      console.log(status.text);
      db.collection('statuses').insertOne(status, (err, res) => {
        console.log('Inserted document with _id: ' + res.insertedId + '\n');
      });
    });

    stream.on('error', (error) => { throw error; });
  });
});
