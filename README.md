# BOMovieBlog
This Project purpose that it containing ; Movies getting from the api and also checking by user and also add any comment what ever like  that provided system.

# How to use Movie api that you can see at the following parts.

|Route |Http|Post Data| Description|
|------|----|---------|------------|
|/api/movie|POST|{'title:"Movie Name","year":YEAR ...'}|To add film that you can use easily the process.|
|/api/movie/betweenFilms/:start_year/:end_year|GET|Null|Between start and end year will get films.|
|/api/movie/top10|GET|Null|Listed Top 10 films|
|/api/movie/searchByTitle/:title|GET|Null|To Bring with Title Film|
|/api/movie|GET|Null|Listing all films|
|/api/movie/:movie_id|PUT|{"title:NewMovieName,..."}|To Update the film|
|/api/movie/:movie_id|GET|Null|Get By Id the film.|
|/api/movie/:movie_id|DELETE|Null|Delete the film.|