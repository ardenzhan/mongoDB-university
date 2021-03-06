const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const options = commandLineOptions();

const url = 'mongodb://localhost:27017';
const dbName = 'crunchbase';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err);
  console.log('Successfully connected to MongoDB.');

  const db = client.db(dbName);

  const query = queryDocument(options);
  const projection = projectionDocument(options);

  getCursor(db, query, (cursor) => {
    cursor.project(projection);

    let numMatches = 0;

    cursor.forEach(
      (doc) => {
        numMatches = numMatches + 1;
        console.log(doc);
      },
      (err) => {
        assert.equal(err, null);
        console.log("Our query was:", JSON.stringify(query));
        console.log("Matching documents:", numMatches);
        client.close();
      }
    );
  });
});

const getCursor = (db, query, callback) => {
  const collection = db.collection('companies');
  const cursor = collection.find(query);
  callback(cursor);
};

const queryDocument = (options) => {
  console.log(options);

  let query = {};

  if ("overview" in options) {
    query.overview = { "$regex": options.overview, "$options": "i" };
  }

  if ("milestones" in options) {
    query["milestones.source_description"] = { "$regex": options.milestones, "$options": "i" };
  }

  return query;
};

const projectionDocument = (options) => {
  let projection = {
    "_id": 0,
    "name": 1,
    "founded_year": 1,
    "overview": 1
  };

  if ("overview" in options) {
    projection.overview = 1;
  }

  if ("milestones" in options) {
    projection["milestones.source_description"] = 1;
  }

  return projection;
}

function commandLineOptions(){
  const optionDefinitions = [
    { name: "overview", alias: "o", type: String },
    { name: "milestones", alias: "m", type: String }
  ];

  let options = commandLineArgs(optionDefinitions);

  const sections = [
    {
      header: "Usage",
      content: "You must supply at least one option. See below."
    },
    {
      header: "Options",
      optionList: optionDefinitions
    }
  ];

  const usage = commandLineUsage(sections);

  if (Object.keys(options).length < 1) {
    console.log(usage);
    process.exit();
  }

  return options;
};
