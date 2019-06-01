# known issues:
1. Errors messages don't include status header. (always 404) 
2. Error handing (Winston in future)
3. Chessboard do not change according to the page size
7. Frontend methods are all in one file
8. Users should have a rating system

# solved issues: 

1. ~Google routes cannot redirect~
2. ~Users do not have a default avatar~
3. ~User fields are inconsistent in the MongoDB database~
4. ~Backend will return a null user for a mysterious reason~
5. ~MongoDB will return the password to the front-end~

# how I did it
## Frontend

* EJS
* JQuery
* Bootstrap 4

## Backend

* Socket.io
* Express
* Node.js
* MongoDB
* Mongoose
* Passport
* Flash
