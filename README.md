# BOMovieBlog
This Project purpose that it containing ; Movies getting from the api and also checking by user and also add any comment what ever like  that provided system.

# How to use Movie api that you can see at the following parts.

# Movie Methods
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

---------------------------------------------------------------

# Director Methods
|Route |Http|Post Data| Description|
|------|----|---------|------------|
|/api/director|POST|{'name:"DirectorName",surname:"DirectorSurname"...'}|To add director that you can use easily the process|
|/api/director|GET|Null|Listing all director each one of details|
|/api/director/:director_id|GET|Null| Get by ID method will get belonging to id the data.|
|/api/director/:director_id|PUT|{name:"NewDirectorName",..}|you can able to be edit what ever you like.|
|/api/director/:director_id|DELETE|Null|To delete the director.|
|/api/director/searchByName/:name|GET|Null|To Bring with name director.|