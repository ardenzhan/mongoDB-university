```
mongo
use crunchbase
db.dropDatabase()
mongoimport -d crunchbase -c companies companies.json
db.companies.createIndex({ permalink: 1 })
```
