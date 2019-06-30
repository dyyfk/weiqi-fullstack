# go-server

A server using Express and Socket.io that enables users to play Chinese go online 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
npm install
npm run mongo
npm run dev
```

# known issues:
1. Errors messages don't include status header. (always 404) 
2. Exception handling (Winston in future)
3. Chessboard does not dynamiclly change according to the page size
5. Chessboard behaves differently in different browser.
6. Error messages do not display properly.
7. Frontend methods are all in one file
8. Users should have a rating system
9. User avatars are inconsistent on the dashboard page 
10. The update users list event is not consistent for different users.

# Credits
## Authors
* **Ruoyu He** - *Frontend and backend* - [dyyfk](https://github.com/dyyfk)
## Special thanks
* **Ryan Liang** - *Help with CSS styling and troubleshooting* - [xmomowan](https://github.com/xmomowan)
* **Yuhen Chen** - *UI Design* - [TheAlmightyHelix](https://github.com/TheAlmightyHelix)

# solved issues: 

1. ~Google routes cannot redirect~
2. ~Users do not have a default avatar~
3. ~User fields are inconsistent in the MongoDB database~
4. ~Backend will return a null user~
5. ~MongoDB will return the password to the front-end~
6. ~Add pagination of the roomlist~
7. ~Links on the headers will disapper if the width is too small~

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
* Express-session
* MongoStore