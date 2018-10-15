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

  const screenNames = ["Marvel", "DCComics", "TheRealStanLee"];
  let done = 0;

  screenNames.forEach((name) => {
    let query = { 'user.screen_name': name };

    const cursor = db.collection('statuses').find(query);
    cursor.sort({ 'id': -1 });
    cursor.limit(1);

    cursor.toArray((err, docs) => {
      assert.equal(err, null);

      if (docs.length == 1) {
        let params = { 'screen_name': name, 'since_id': docs[0].id, 'count': 10 };
      } else {
        let params = { 'screen_name': name, 'count': 10 };
      }

      TwitterClient.get('statuses/user_timeline', params, (err, statuses, response) {
        assert.equal(err, null);
        db.collection('statuses').insertMany(statuses, (err, res) {
          console.log(res);
          done += 1;
          if (done == screenNames.length) {
            client.close();
          }
        });
      });
    });
  });
});
