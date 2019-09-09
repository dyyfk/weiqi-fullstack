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
- [ ] Handle edge cases for socket session expiration
- [ ] Add more user-friendly error message
- [ ] Let users to leave the game if his opponent leaves
- [ ] Rooms created by users will be overwritten names when searching for match
- [ ] Add timers to the game
- [ ] Inform the reconnected users if the game has ended.
- [ ] Change the data structure of chess store in database.
- [ ] Fix the queuing mechanism, players already in game or queue should not be paired.
- [ ] Users should be able to select the ranking when registering.
- [ ] The users can only resign when both users are connected.
- [ ] The users can have duplicated names
- [ ] Google user does not have an email
- [ ] Repeated refreshing sometimes could have the chessrecord not loaded in successfully



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
- [x] Add authentication to matchmaking if users already in a game
- [x] Stores the game result in the database
- [x] The displayed room list should be reversed.