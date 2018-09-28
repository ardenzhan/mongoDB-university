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

**2.6 )** Suppose you wish to update the value of the "plot" field for one document to correct a typo. Which of the following update operators and modifiers would you need to use to do this? Choose the best answer:
- [x] $set
- [ ] $unset
- [ ] $rename
- [ ] $slice
- [ ] $sort
- [ ] $each
- [ ] $position
- [ ] $push
- [ ] $addToSet

## Quiz
### Arrays with Nested Documents
Suppose our movie details documents are structured so that rather than contain an awards field that looks like this:
```
"awards" : {
  "wins" : 56,
  "nominations" : 86,
  "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
}
```
they are structured with an awards field as follows:
```
"awards" : {
    "oscars" : [
        {"award": "bestAnimatedFeature", "result": "won"},
        {"award": "bestMusic", "result": "won"},
        {"award": "bestPicture", "result": "nominated"},
        {"award": "bestSoundEditing", "result": "nominated"},
        {"award": "bestScreenplay", "result": "nominated"}
    ],
    "wins" : 56,
    "nominations" : 86,
    "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
}
```
What query would we use in the Mongo shell to return all movies in the video.movieDetails collection that either won or were nominated for a best picture Oscar? You may assume that an award will appear in the `oscars` array only if the movie won or was nominated. You will probably want to create a little sample data for yourself in order to work this problem.

HINT: For this question we are looking for the simplest query that will work. This problem has a very straightforward solution, but you will need to extrapolate a little from some of the information presented in the "Reading Documents" lesson.
```
db.movieDetails.find({"awards.oscars.award": "bestPicture"})
```

### Updating Based on Multiple Criteria
Write an update command that will remove the "tomato.consensus" field for all documents matching the following criteria:
  - The number of imdb votes is less than 10,000
  - The year for the movie is between 2010 and 2013 inclusive
  - The tomato.consensus field is null

How many documents required an update to eliminate a "tomato.consensus" field?

You can arrive at the answer here in a couple of different ways, either of which provide some good learning opportunities. The key is realizing that you need to report on the number of documents that actually required an update to remove the `tomato.consensus` field. You can do this either by ensuring that you filter for only those documents that do not contain a `tomato.consensus` field or by recognizing that only 13 documents were actually modified by your update.

Using the first approach, you can issue the following command.
```
db.movieDetails.updateMany({ year: {$gte: 2010, $lte: 2013},
                             "imdb.votes": {$lt: 10000},
                             $and: [{"tomato.consensus": {$exists: true} },
                                    {"tomato.consensus": null} ] },
                           { $unset: { "tomato.consensus": "" } });
```
In response, you will receive the following:
```
{ "acknowledged" : true, "matchedCount" : 13, "modifiedCount" : 13 }
```
Using the second approach, you can issue a simpler command, but one that is not precise about what needs to be updated.
```
db.movieDetails.updateMany({ year: {$gte: 2010, $lte: 2013},
                             "imdb.votes": {$lt: 10000},
                             "tomato.consensus": null },
                           { $unset: { "tomato.consensus": "" } });
```
In response, you will receive the following:
```
{ "acknowledged" : true, "matchedCount" : 204, "modifiedCount" : 13 }
```
Note that while the query portion of the update matches 204 documents, only 13 documents actually required an update.
