## Quiz
### Projection
```
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"founded_year": 2010};

    var cursor = db.collection('companies').find(query);

    /* TODO: Write your line of code here. */

    cursor.forEach(
        function(doc) {
            console.log(doc.name + " has " + doc.number_of_employees + " employees.");
        },
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );
});
```
Write ONE LINE OF CODE that will cause only the name and number\_of\_employees fields to be returned in query results.
```
cursor.project({"name": 1, "number_of_employees": 1, "_id": 0});
```

### Sort, Skip, Limit
MongoDB will always sort, skip, then limit. The order of the constraints applied to the cursor doesn't matter.

Suppose you have a MongoDB collection called school.grades that is composed solely of these 20 documents:
```
{"_id": 1, "student": "Mary", "grade": 45, "assignment": "homework"}
{"_id": 2, "student": "Alice", "grade": 48, "assignment": "homework"}
{"_id": 3, "student": "Fiona", "grade": 16, "assignment": "quiz"}
{"_id": 4, "student": "Wendy", "grade": 12, "assignment": "homework"}
{"_id": 5, "student": "Samantha", "grade": 82, "assignment": "homework"}
{"_id": 6, "student": "Fay", "grade": 89, "assignment": "quiz"}
{"_id": 7, "student": "Katherine", "grade": 77, "assignment": "quiz"}
{"_id": 8, "student": "Stacy", "grade": 73, "assignment": "quiz"}
{"_id": 9, "student": "Sam", "grade": 61, "assignment": "homework"}
{"_id": 10, "student": "Tom", "grade": 67, "assignment": "exam"}
{"_id": 11, "student": "Ted", "grade": 52, "assignment": "exam"}
{"_id": 12, "student": "Bill", "grade": 59, "assignment": "exam"}
{"_id": 13, "student": "Bob", "grade": 37, "assignment": "exam"}
{"_id": 14, "student": "Seamus", "grade": 33, "assignment": "exam"}
{"_id": 15, "student": "Kim", "grade": 28, "assignment": "quiz"}
{"_id": 16, "student": "Sacha", "grade": 23, "assignment": "quiz"}
{"_id": 17, "student": "David", "grade": 18, "assignment": "exam"}
{"_id": 18, "student": "Steve", "grade": 14, "assignment": "homework"}
{"_id": 19, "student": "Burt", "grade": 90, "assignment": "quiz"}
{"_id": 20, "student": "Stan", "grade": 92, "assignment": "exam"}
```
Assuming the variable db holds a connection to the school database in the following code snippet,
```
var cursor = db.collection("grades").find({});
cursor.sort({"grade": -1});
cursor.skip(4);
cursor.limit(2);
```
Which student's documents will be returned as part of a subsequent call to toArray()?
 - [ ] Mary, Alice
 - [ ] Fiona, Wendy
 - [ ] Samantha, Fay
 - [x] Katherine, Stacy
 - [ ] Sam, Tom
 - [ ] Ted, Bill
 - [ ] Bob, Seamus
 - [ ] Kim, Sacha
 - [ ] David, Steve
 - [ ] Burt, Stan

## Homework
### 3.1
When using find() in the Node.js driver, which of the following best describes when the driver will send a query to MongoDB?
 - [x] When we call a cursor method passing a callback function to process query results
 - [ ] When find() is called
 - [ ] When a cursor's project() method is called
 - [ ] When a cursor's skip() method is called
 - [ ] When a cursor's limit() method is called
 - [ ] When a cursor's sort() method is called
 - [ ] Only when forEach is called

### 3.2
Sort, Skip, Limit Quiz
```
var cursor = db.collection("grades").find({});
cursor.skip(6);
cursor.limit(2);
cursor.sort({"grade": 1});
```
- [x] Seamus, Bob

### 3.3
**Enter the average number (three digits) of employees per company reported in the output.**
As a check, the total number of unique companies reported by the application should equal 42.
```
function queryDocument(options) {
    var query = {
        "tag_list": {"$regex": "social-networking"},
    };

    if (("firstYear" in options) && ("lastYear" in options)) {
        query.founded_year = { "$gte": options.firstYear, "$lte": options.lastYear };
    } else if ("firstYear" in options) {
        query.founded_year = { "$gte": options.firstYear };
    } else if ("lastYear" in options) {
        query.founded_year = { "$lte": options.lastYear };
    }

    if ("city" in options) {
        query["offices.city"] = options.city;
    }

    return query;
}
```

### 3.4
**Enter the average number (two digits) of employees per company reported in the output.**
As a check, the total number of unique companies reported by the application should equal 194.
```
function queryDocument(options) {
    var query = {};

    if ("overview" in options) {
        query["$or"] = [
            {"overview": {"$regex": options.overview, "$options": "i"}},
            {"tag_list": {"$regex": options.overview, "$options": "i"}}
        ];
    }

    if ("milestones" in options) {
        query["milestones.source_description"] =
            {"$regex": options.milestones, "$options": "i"};
    }

    return query;
}
```
