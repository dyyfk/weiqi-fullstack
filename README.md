# go-server
![GitHub Logo](/images/logo.png)
<h3 align="center"> A contemporary take on the traditional Chinese game Go that allows players to strech their brains in a browser. </h3>

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### 🖐 Prerequisites

What things you need to install the software and how to install them
1. With npm and MongoDB
    1. npm
    ```sh
    npm install npm@latest -g
    ```

    2. MongoDB
    [Installation](https://docs.mongodb.com/manual/installation/)

2. With Docker
    1. Docker
    [Installation](https://docs.docker.com/install/)

    ```
    docker-compose up
    ```

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

Go to localhost:3000 to see the server running (localhost:80 for users using docker)

## 👥 Credits
### Authors
* **Ruoyu He** - *Frontend and backend* - [dyyfk](https://github.com/dyyfk)
* **Yuhen Chen** - *UI Design* - [TheAlmightyHelix](https://github.com/TheAlmightyHelix)
### Special thanks
* **Ryan Liang** - *Help with CSS and troubleshoot* - [xmomowan](https://github.com/xmomowan)

## how we made it
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
- [ ] Errors messages don't include status header. (always 404) 
- [ ] Exception handling (Winston in future)
- [ ] Error messages do not display properly.
- [ ] Frontend methods are all in one file
- [ ] Users should have a rating system
- [ ] User avatars are inconsistent on the dashboard page 
- [ ] The room status is not being updated correctly
- [ ] Add authentication to matchmaking if users already in a game

### ✅ solved issues: 
- [x] Google routes cannot redirect
- [x] Users do not have a default avatar
- [x] User fields are inconsistent in the MongoDB database
- [x] Backend will return a null user
- [x] MongoDB will return the password to the front-end
- [x] No pagination of the roomlist if it is too long
- [x] Links on the headers will disappear if the width is too small
- [x] Chessboard behaves differently in different browsers
- [x] Chessboard does not dynamiclly change according to the page size
- [x] The update users list event is not consistent for different users.


## Acknowledgements
* [Font Awesome](https://fontawesome.com)
* [DataTable](https://datatables.net/)
* [Mongoose](https://mongoosejs.com/)
* [Bootswatch](https://bootswatch.com/)
* [Easytimer](https://albert-gonzalez.github.io/easytimer.js/)

