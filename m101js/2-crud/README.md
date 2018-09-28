## Homework
Use `video.movieDetails` from the "Creating Documents" dump

**2.1 )** Find the title of a movie from the year 2013 that is rated PG-13 and won no awards.
```
db.movieDetails.find({ "rated": "PG-13", "year": 2013, "awards.wins": 0 })
```

**2.2 )** Which of the following queries would produce output documents that resemble the following:
```
{ "title" : "P.S. I Love You" }
{ "title" : "Love Actually" }
{ "title" : "Shakespeare in Love" }
```
Queries that include projection documents such as `{ title: 1, _id: 0 }`

**2.3 )** How many movies list "Sweden" second in the list of countries?
```
db.movieDetails.find({ "countries.1": "Sweden" })
```

**2.4 )** How many documents list just "Comedy" and "Crime" as genres with "Comedy" listed first?
```
db.movieDetails.find({ "genres": ["Comedy", "Crime"] }).count()
```

**2.5 )** How many documents list both "Comedy" and "Crime" as genres regardless of how many other genres are listed?
```
db.movieDetails.find({ "genres": { $all: ["Comedy", "Crime"] } }).count()
```

**2.6 )** Suppose you wish to update the value of the "plot" field for one document to correct a typo.\
Which of the following update operators and modifiers would you need to use to do this?\
Choose the best answer:
- [x] $set
- [ ] $unset
- [ ] $rename
- [ ] $slice
- [ ] $sort
- [ ] $each
- [ ] $position
- [ ] $push
- [ ] $addToSet
