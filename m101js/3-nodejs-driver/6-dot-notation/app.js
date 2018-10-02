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
    "number_of_employees": 1,
    "ipo.valuation_amount": 1,
    "offices.country_code": 1
  };

  const cursor = db.collection('companies').find(query);
  cursor.project(projection);

  let numMatches = 0;

  cursor.forEach(
    (doc) => {
      numMatches = numMatches + 1;
      console.log(doc);
    },
    (err) => {
      assert.equal(err, null);
      console.log("Query:", JSON.stringify(query));
      console.log("Matching Documents:", numMatches);
      client.close();
    }
  );
});

const queryDocument = (options) => {
  console.log(options);

  let query = {
    "founded_year": { "$gte": options.firstYear, "$lte": options.lastYear }
  };

  if ("employees" in options) {
      query.number_of_employees = { "$gte": options.employees };
  }

  if ("ipo" in options) {
    if (options.ipo == "yes") {
      query["ipo.valuation_amount"] = { "$exists": true, "$ne": null };
    }
    else if (options.ipo == "no") {
      query["ipo.valuation_amount"] = null;
    }
  }

  if ("country" in options) {
    query["offices.country_code"] = options.country;
  }

  return query;
};

function commandLineOptions(){
  const optionDefinitions = [
    { name: "firstYear", alias: "f", type: Number },
    { name: "lastYear", alias: "l", type: Number },
    { name: "employees", alias: "e", type: Number },
    { name: "ipo", alias: "i", type: String },
    { name: "country", alias: "c", type: String }
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

  if (Object.keys(options).length < 1) {
    console.log(usage);
    process.exit();
  }

  return options;
};
