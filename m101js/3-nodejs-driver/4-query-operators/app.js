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
  const projection = {"_id": 1, "name": 1, "founded_year": 1,
                      "number_of_employees": 1, "crunchbase_url": 1};

  let cursor = db.collection('companies').find(query);
  cursor.project(projection);

  let numMatches = 0;

  cursor.forEach(
    (doc) => {
      numMatches += 1;
      console.log(doc);
    },
    (err) => {
      assert.equal(err, null);
      console.log("Our query was: " + JSON.stringify(query));
      console.log("Matching documents: " + numMatches);
      client.close();
    }
  );
});

function queryDocument(options) {
  console.log(options);
  let query = {
    "founded_year": {
      "$gte": options.firstYear,
      "$lte": options.lastYear
    }
  };
  if (options.employees) {
    query.number_of_employees = { "$gte": options.employees };
  }
  return query;
}

function commandLineOptions() {
  const optionDefinitions = [
    { name: "firstYear", alias: "f", type: Number },
    { name: "lastYear", alias: "l", type: Number },
    { name: "employees", alias: "e", type: Number }
  ];
  const options = commandLineArgs(optionDefinitions);

  const sections = [
    {
      header: 'Usage',
      content: 'The first two options below are required. The rest are optional.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    }
  ];
  const usage = commandLineUsage(sections);

  // Three ways to check if property exists in object (all check differently):
  // if (!(options.firstYear && options.lastYear)) {
  // if (!(options.hasOwnProperty("firstYear") && options.hasOwnProperty("lastYear"))) {
  if (!("firstYear" in options && "lastYear" in options)) {
    console.log(usage);
    process.exit();
  }

  return options;
}
