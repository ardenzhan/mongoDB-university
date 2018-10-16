## Lab 0
```
mongoimport --drop -d mongomart -c item data/items.json
mongoimport --drop -d mongomart -c cart data/cart.json
```
If you've set up and launched MongoMart correctly, you should see a page that lists the same product repeated five times. Which of the following products is it?
 - [x] Gray Hooded Sweatshirt
 - [ ] WiredTiger T-shirt
 - [ ] MongoDB University Book
 - [ ] Powered by MongoDB Sticker
 - [ ] Stress Ball

## Lab 1
The items.js file implements data access for the item collection. The item collection contains the product catalog for the MongoMart application.

The mongomart.js application instantiates an item data access object (DAO) with this call:
```
var items = new ItemDAO(db);
```
The DAO, items, is used throughout mongomart.js to implement several of the routes in this application.

In this lab, you will implement the methods in items.js necessary to support the root route or "/". This route is implemented in mongomart.js in the function that begins with this line:
```
router.get("/", function(req, res) {
```
The methods you will implement in items.js are: getCategories(), getItems(), and getNumItems(). The comments in each of these methods describe in detail what you need to do to implement each method. When you believe you are finished, restart the mongomart.js application and evaluate your application to see whether it matches the following description.

If you have completed this lab correctly, the landing page for Mongomart should now show the following five products: Gray Hooded Sweatshirt, Coffee Mug, Stress Ball, Track Jacket, and Women's T-shirt. On the left side of the page you should see nine product categories listed, beginning with "All" and ending with "Umbrellas". At the bottom of the page you should see tabs for pages 1-5 with the statement "23 Products" immediately underneath.

If your application matches the above description, please answer the following question.

Select the "Apparel" category by clicking on it with your mouse. This category contains six products. MongoMart will paginate the products in this category into two pages. Which of the following items is listed on the second page? There should be only one item on this page. Please make sure you are sorting query results as specified in the Lab 1 instructions or you might get the wrong answer.
 - [ ] Gray Hooded Sweatshirt
 - [ ] Track Jacket
 - [ ] Women's T-shirt
 - [x] WiredTiger T-shirt
 - [ ] Green T-shirt
 - [ ] MongoDB University T-shirt
