# go-server
![GitHub Logo](/images/logo.png)
A server using Express and Socket.io that enables users to play Chinese go online 

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### 🖐 Prerequisites

What things you need to install the software and how to install them

* npm
```sh
npm install npm@latest -g
```

* MongoDB
[Installation](https://docs.mongodb.com/manual/installation/)

### ⏳ Installation

1. There is no need for any API Key, since that's already included in the repo itself
2. Clone the repo
```sh
git clone https://github.com/dyyfk/go-server.git
```
3. Install NPM packages
```sh
npm install
```
4. ~Enter your API in `config.js`~
```JS
const API_KEY = 'ENTER YOUR API';
```

## 🛠 Usage

Go to localhost:3000 to see the server running

## 👥 Credits
### Authors
* **Ruoyu He** - *Frontend and backend* - [dyyfk](https://github.com/dyyfk)
* **Yuhen Chen** - *UI Design* - [TheAlmightyHelix](https://github.com/TheAlmightyHelix)
### Special thanks
* **Ryan Liang** - *Help with CSS and troubleshoot* - [xmomowan](https://github.com/xmomowan)

## how I did it
### Frontend

* EJS
* JQuery
* Bootstrap 4

### Backend

* Socket.io
* Express
* Node.js
* MongoDB
* Mongoose
* Passport
* Flash
* Express-session
* MongoStore

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Below is a list of issues you might be interested in fixing or improving.**

### ❎ known issues:
1. Errors messages don't include status header. (always 404) 
2. Exception handling (Winston in future)
6. Error messages do not display properly.
7. Frontend methods are all in one file
8. Users should have a rating system
9. User avatars are inconsistent on the dashboard page 
10. The update users list event is not consistent for different users.
### ✅ solved issues: 
1. - [x] Google routes cannot redirect~
2. ~Users do not have a default avatar~
3. ~User fields are inconsistent in the MongoDB database~
4. ~Backend will return a null user~
5. ~MongoDB will return the password to the front-end~
6. ~No pagination of the roomlist if it is too long~
7. ~Links on the headers will disappear if the width is too small~
8. ~Chessboard behaves differently in different browsers~
9. ~Chessboard does not dynamiclly change according to the page size~


## Acknowledgements
* [Font Awesome](https://fontawesome.com)
* [DataTable](https://datatables.net/)
* [Mongoose](https://mongoosejs.com/)
* [Bootswatch](https://bootswatch.com/)
