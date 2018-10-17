const assert = require('assert');

class ItemDAO {
  constructor(database) {
    this.db = database;
  }

  /*
  * TODO LAB #1A: Implement the getCategories() method.
  *
  * Write an aggregation query on the "item" collection to return the
  * total number of items in each category. The documents in the array
  * output by your aggregation should contain fields for "_id" and "num".
  *
  * In addition to the categories created by your aggregation query,
  * include a document for category "All" in the array of categories
  * passed to the callback. The "All" category should contain the total
  * number of items across all categories as its value for "num". The
  * most efficient way to calculate this value is to iterate through
  * the array of categories produced by your aggregation query, summing
  * counts of items in each category.
  *
  * Ensure categories are organized in alphabetical order before passing
  * to the callback.
  */
  getCategories(callback) {
    let pipeline = [
      { "$group": { _id: "$category", num: { "$sum": 1 } } },
      { "$sort": { _id: 1 } }
    ];

    this.db.collection("item").aggregate(pipeline).toArray((err, categories) => {
      assert.equal(err, null);

      let total = 0;
      for (let i = 0; i < categories.length; i++) {
        total += categories[i].num;
      }
      categories.unshift({ _id: "All", num: total });

      callback(categories);
    });
  };


  /*
   * TODO LAB #1B: Implement the getItems() method.
   *
   * Create a query on the "item" collection to select only the items
   * that should be displayed for a particular page of a given category.
   * The category is passed as a parameter to getItems().
   *
   * Use sort(), skip(), and limit() and the method parameters: page and
   * itemsPerPage to identify the appropriate products to display on each
   * page. Pass these items to the callback function.
   *
   * Sort items in ascending order based on the _id field. You must use
   * this sort to answer the final project questions correctly.
   *
   * Note: Since "All" is not listed as the category for any items,
   * you will need to query the "item" collection differently for "All"
   * than you do for other categories.
   */
  getItems(category, page, itemsPerPage, callback) {
    let query;
    if (category == "All") {
      query = {};
    } else {
      query = { category: category };
    }

    let cursor = this.db.collection('item').find(query);
    cursor.sort({ _id: 1 });
    cursor.skip(page * itemsPerPage);
    cursor.limit(itemsPerPage);
    cursor.toArray((err, pageItems) => {
      assert.equal(err, null);
      callback(pageItems);
    });
  };


  /*
   * TODO LAB #1C: Implement the getNumItems method()
   *
   * Write a query that determines the number of items in a category
   * and pass the count to the callback function. The count is used in
   * the mongomart application for pagination. The category is passed
   * as a parameter to this method.
   *
   * See the route handler for the root path (i.e. "/") for an example
   * of a call to the getNumItems() method.
   */
  getNumItems(category, callback) {
    let query;
    if (category == "All") {
      query = {};
    } else {
      query = { category: category };
    }

    this.db.collection('item').find(query).count((err, numItems) => {
      assert.equal(err, null);
      callback(numItems);
    });
  }


  /*
   * TODO LAB #2A: Implement searchItems()
   *
   * Using the value of the query parameter passed to searchItems(),
   * perform a text search against the "item" collection.
   *
   * Sort the results in ascending order based on the _id field.
   *
   * Select only the items that should be displayed for a particular
   * page. For example, on the first page, only the first itemsPerPage
   * matching the query should be displayed.
   *
   * Use limit() and skip() and the method parameters: page and
   * itemsPerPage to select the appropriate matching products. Pass these
   * items to the callback function.
   *
   * searchItems() depends on a text index. Before implementing
   * this method, create a SINGLE text index on title, slogan, and
   * description. You should simply do this in the mongo shell.
   */
  searchItems(query, page, itemsPerPage, callback) {
    let queryDoc;
    if (query.trim() == "") {
      queryDoc = {};
    } else {
      queryDoc = { "$text": { "$search": query } };
    }

    let cursor = this.db.collection('item').find(queryDoc);
    cursor.sort({ _id: 1 });
    cursor.skip(page * itemsPerPage);
    cursor.limit(itemsPerPage);
    cursor.toArray((err, items) => {
      assert.equal(err, null);
      callback(items);
    });
  }


  /*
  * TODO LAB #2B: Using the value of the query parameter passed to this
  * method, count the number of items in the "item" collection matching
  * a text search. Pass the count to the callback function.
  *
  * getNumSearchItems() depends on the same text index as searchItems().
  * Before implementing this method, ensure that you've already created
  * a SINGLE text index on title, slogan, and description. You should
  * simply do this in the mongo shell.
  */
  getNumSearchItems(query, callback) {
    let queryDoc;
    if (query.trim() == "") {
      queryDoc = {};
    } else {
      queryDoc = { "$text": { "$search": query } };
    }

    this.db.collection('item').find(queryDoc).count((err, numItems) => {
      assert.equal(err, null);
      callback(numItems);
    });
  }


  /*
   * TODO LAB #3: Implement the getItem() method.
   *
   * Using the itemId parameter, query the "item" collection by
   * _id and pass the matching item to the callback function.
   *
   */
  getItem(itemId, callback) {
    this.db.collection('item').find({ _id: itemId }).toArray((err, items) => {
      assert.equal(err, null);

      let item = null;
      if (items.length > 0) {
        item = items[0];
      }
      callback(item);
    });
  }

  getRelatedItems(callback) {
    this.db.collection('item').find({})
    .limit(4)
    .toArray((err, relatedItems) => {
      assert.equal(err, null);
      callback(relatedItems);
    });
  }


  addReview(itemId, comment, name, stars, callback) {
    // this.addReview = function(itemId, comment, name, stars, callback) {
    //     "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        var doc = this.createDummyItem();
        doc.reviews = [reviewDoc];

        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        callback(doc);
    }


  createDummyItem() {
    // this.createDummyItem = function() {
    //     "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}

module.exports.ItemDAO = ItemDAO;
