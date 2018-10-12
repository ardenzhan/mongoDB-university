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

  const projection = {
    "_id": 0,
    "name": 1,
    "founded_year": 1,
    "number_of_employees": 1
  };

  const cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.limit(options.limit);
  cursor.skip(options.skip);
  cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);

  let numMatches = 0;

  cursor.forEach(
    (doc) => {
      numMatches += 1;
      console.log(doc.name + "\n\tfounded " + doc.founded_year +
                  "\n\t" + doc.number_of_employees + " employees");
    },
    (err) => {
      assert.equal(err, null);
      console.log("Our query was:" + JSON.stringify(query));
      console.log("Matching documents: " + numMatches);
      client.close();
    }
  );
});

const queryDocument = (options) => {
  let query = {
    "founded_year": { "$gte": options.firstYear, "$lte": options.lastYear }
  };

  if ("employees" in options) {
    query.number_of_employees = { "$gte": options.employees };
  }

  return query;
}

function commandLineOptions() {
  const optionDefinitions = [
    { name: "firstYear", alias: "f", type: Number },
    { name: "lastYear", alias: "l", type: Number },
    { name: "employees", alias: "e", type: Number },
    { name: "skip", type: Number, defaultValue: 0 },
    { name: "limit", type: Number, defaultValue: 20000 }
  ];

  let options = commandLineArgs(optionDefinitions);

  const sections = [
    {
      header: "Usage",
      content: "The first two options are required. The rest optional."
    },
    {
      header: "Options",
      optionList: optionDefinitions
    }
  ];

  const usage = commandLineUsage(sections);

  // if (Object.keys(options).length < 1) {
  if ( !(("firstYear" in options) && ("lastYear" in options)) ){
    console.log(usage);
    process.exit();
  }

  return options;
}
