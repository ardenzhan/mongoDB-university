## Homework
**2.1 )** Query `video.movieDetails` from the "Creating Documents" dump to find the title of a movie from the year 2013 that is rated PG-13 and won no awards.

`db.movieDetails.find({ "rated": "PG-13", "year": 2013, "awards.wins": 0 })`
