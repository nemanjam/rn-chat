# RN Chat

Chat app made with React Native, NativeBase, Apollo Hooks and Sequelize.

## Features

- JWT auth with email and password strategy
- Users, Groups, Chats, Profile, Login, Register, Group Details screens
- Users/Friends, Public/Private Groups, All Users/Group Users tabs, Drawer, Toasts
- queries for users, friends, chats, public and private groups
- create, edit, delete group, add, remove user from group mutations with cache updates
- add, remove friend mutations with cache updates
- refetching on the Users, Groups and Chats screens
- message in chat added, group added and message in group added subscriptions
- cursor Relay pagination on the Users list
- Sequelize User, Group, Chat, Message models
- GroupUser, ChatUser, BannedGroupUser, Friends `m:n` relations
- Messages-User, Messages-Chat `n:1` relations
- database seed

## Libraries used

- React Native 0.61 with React Hooks, NativeBase
- React Navigation 4.0, Redux, Redux Thunk
- Apollo Client, Apollo Server
- Sequelize, PostgreSQL
- Formik, Faker, React Native Gifted Chat

## Installation and running

### Server

- `cd server` and `npm install` to install the dependecies
- set database connection in the `server/src/data/connectors.js` for example `new Sequelize('postgres://dbuser:password@localhost:5432/chat',...`
- uncomment `db.sync({ force: true }).then(async () => await seed()).catch(error => console.log(error));` in the `server/src/data/connectors.js` to seed the database
- `npm run start` http server and GraphQL playground wil be loaded on `http://localhost:5000` and subscriptions on the `ws://localhost/graphql`

### Client

- `cd client` and `yarn install` to install the dependecies
- set the server url in the `client/src/App.js` for example `const uri = '10.0.2.2:5000';` or `const uri = '192.168.0.185:5000';`
- `yarn run android` to run React Native client on the running Android emulator
- login with the `email@email.com`, `123456`

## Screenshots

<img src="/screenshots/Screenshot_1.png" width="270"/> <img src="/screenshots/Screenshot_2.png" width="270"/> <img src="/screenshots/Screenshot_3.png" width="270"/>

<img src="/screenshots/Screenshot_4.png" width="270"/> <img src="/screenshots/Screenshot_5.png" width="270"/> <img src="/screenshots/Screenshot_6.png" width="270"/>

<img src="/screenshots/Screenshot_7.png" width="270"/> <img src="/screenshots/Screenshot_8.png" width="270"/> <img src="/screenshots/Screenshot_9.png" width="270"/>

<img src="/screenshots/Screenshot_10.png" width="270"/> <img src="/screenshots/Screenshot_11.png" width="270"/> <img src="/screenshots/Screenshot_12.png" width="270"/>

## Database ER diagram

<img src="/screenshots/database.png" />
