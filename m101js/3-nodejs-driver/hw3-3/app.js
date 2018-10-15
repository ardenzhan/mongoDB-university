const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const allOptions = [
  {
    firstYear: 2002,
    lastYear: 2016,
    city: "Palo Alto"
  },
  {
    lastYear: 2010,
    city: "New York"
  },
  {
    city: "London"
  }
];

let numQueriesFinished = 0;
let companiesSeen = {};

const queryMongoDB = (query, queryNum) => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'crunchbase';
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    assert.equal(err, null);
    console.log("Successfully connected to MongoDB for query: " + queryNum);

    const db = client.db(dbName);
    let cursor = db.collection('companies').find(query);

    let numMatches = 0;
    cursor.forEach(
      (doc) => {
        numMatches = numMatches + 1;
        if (doc.permalink in companiesSeen) return;
        companiesSeen[doc.permalink] = doc;
      },
      (err) => {
        assert.equal(err, null);
        console.log("Query " + queryNum + " was:" + JSON.stringify(query));
        console.log("Matching documents: " + numMatches);
        numQueriesFinished = numQueriesFinished + 1;
        if (numQueriesFinished == allOptions.length) {
          report();
        }
        client.close();
      }
    );
  });
}

const queryDocument = (options) => {
  console.log(options);

  let query = { "tag_list":
    // TODO: Complete this statement to match the regular expression "social-networking"
    {"$regex": "social-networking", "$options": "i"}
  };

  if (("firstYear" in options) && ("lastYear" in options)) {
    /*
     * TODO: Write one line of code to ensure that if both firstYear and lastYear
     * appear in the options object, we will match documents that have a value for
     * the "founded_year" field of companies documents in the correct range.
    */
    query.founded_year = { "$gte": options.firstYear, "$lte": options.lastYear };
  } else if ("firstYear" in options) {
    query.founded_year = { "$gte": options.firstYear };
  } else if ("lastYear" in options) {
    query.founded_year = { "$lte": options.lastYear };
  }

  if ("city" in options) {
    /*
     * TODO: Write one line of code to ensure that we do an equality match on the
     * "offices.city" field. The "offices" field stores an array in which
     * each element is a nested document containing fields that describe
     * a corporate office. Each office document contains a "city" field.
     * A company may have multiple corporate offices.
    */
    query["offices.city"] = options.city;
  }

  return query;
}

const report = (options) => {
  let totalEmployees = 0;
  for (key in companiesSeen) {
    totalEmployees = totalEmployees + companiesSeen[key].number_of_employees;
  }

  let companiesList = Object.keys(companiesSeen).sort();
  console.log("Companies found: " + companiesList.join(', '));
  console.log("Total employees in companies identified: " + totalEmployees);
  console.log("Total unique companies: " + companiesList.length);
  console.log("Average number of employees per company: " + Math.floor(totalEmployees / companiesList.length));
}

for (let i = 0; i < allOptions.length; i++) {
  let query = queryDocument(allOptions[i]);
  queryMongoDB(query, i);
}
