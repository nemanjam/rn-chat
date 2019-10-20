import faker from 'faker';
import { UserModel, ChatModel, MessageModel, GroupModel } from './connectors';
import bcrypt from 'bcrypt';

const seed = async () => {
  const hash = await bcrypt.hash('123456', 10);
  return Promise.all([
    UserModel.create({
      username: 'firstUser',
      email: 'email1@email.com',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'secondUser',
      email: 'email2@email.com',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'thirdUser',
      email: 'email3@email.com',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'fourthUser',
      email: 'email4@email.com',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'fifthUser',
      email: 'email5@email.com',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      isActive: true,
      lastActiveAt: new Date(),
    }),
    ChatModel.create({
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    ChatModel.create({
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    ChatModel.create({
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    ChatModel.create({
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    MessageModel.create({
      text: faker.lorem.sentences(3),
      createdAt: new Date(),
    }),
    GroupModel.create({
      name: 'firstGroup',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      isPrivate: true,
    }),
    GroupModel.create({
      name: 'secondGroup',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      isPrivate: false,
    }),
  ])
    .then(
      ([
        firstUser,
        secondUser,
        thirdUser,
        fourthUser,
        fifthUser,
        firstChat,
        secondChat,
        thirdChat,
        fourthChat,
        firstMessage,
        secondMessage,
        thirdMessage,
        fourthMessage,
        fifthMessage,
        sixthMessage,
        seventhMessage,
        eighthMessage,
        firstGroup,
        secondGroup,
      ]) => {
        return Promise.all([
          firstUser.addChat(firstChat),
          secondUser.addChat(firstChat),
          firstUser.addFriend(secondUser),
          secondUser.addFriend(firstUser), //
          firstMessage.setChat(firstChat),
          secondMessage.setChat(firstChat),
          firstUser.setMessage(secondMessage),
          secondUser.setMessage(firstMessage),

          firstUser.addChat(secondChat),
          thirdUser.addChat(secondChat),
          firstUser.addFriend(thirdUser),
          thirdUser.addFriend(firstUser), //
          thirdMessage.setChat(secondChat),
          fourthMessage.setChat(secondChat),
          firstUser.setMessage(fourthMessage),
          thirdUser.setMessage(thirdMessage),

          /*
          firstUser.addChat(thirdChat),
          fourthUser.addChat(thirdChat),
          // firstUser.addFriend(fourthUser),
          // fourthUser.addFriend(firstUser),
          fifthMessage.setChat(thirdChat),
          sixthMessage.setChat(thirdChat),
          firstUser.setMessage(sixthMessage),
          fourthUser.setMessage(fifthMessage),

          firstUser.addChat(fourthChat),
          fifthUser.addChat(fourthChat),
          // firstUser.addFriend(fifthUser),
          // fifthUser.addFriend(firstUser),
          seventhMessage.setChat(fourthChat),
          eighthMessage.setChat(fourthChat),
          firstUser.setMessage(eighthMessage),
          fifthUser.setMessage(seventhMessage),
          */

          firstUser.addGroup(firstGroup),
          fourthUser.addGroup(firstGroup),
          fifthMessage.setChat(thirdChat),
          sixthMessage.setChat(thirdChat),
          thirdChat.setGroup(firstGroup),
          firstUser.setMessage(sixthMessage),
          fourthUser.setMessage(fifthMessage),
          firstGroup.setOwner(firstUser),

          firstUser.addGroup(secondGroup),
          fifthUser.addGroup(secondGroup),
          seventhMessage.setChat(fourthChat),
          eighthMessage.setChat(fourthChat),
          fourthChat.setGroup(secondGroup),
          firstUser.setMessage(eighthMessage),
          fifthUser.setMessage(seventhMessage),
          secondGroup.setOwner(firstUser),
        ]);
      },
    )
    .catch(error => console.log(error));
};

export default seed;
