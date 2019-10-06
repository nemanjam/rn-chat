import faker from 'faker';
import { UserModel, ChatModel, MessageModel } from './connectors';

const seed = () => {
  return Promise.all([
    UserModel.create({
      username: 'firstUser',
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: faker.internet.password(),
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'secondUser',
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: faker.internet.password(),
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'thirdUser',
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: faker.internet.password(),
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'fourthUser',
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: faker.internet.password(),
      isActive: true,
      lastActiveAt: new Date(),
    }),
    UserModel.create({
      username: 'fifthUser',
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: faker.internet.password(),
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
      ]) => {
        return Promise.all([
          firstUser.addChat(firstChat),
          secondUser.addChat(firstChat),
          firstUser.addContact(secondUser),
          secondUser.addContact(firstUser), //
          firstMessage.setChat(firstChat),
          secondMessage.setChat(firstChat),
          firstUser.setMessage(secondMessage),
          secondUser.setMessage(firstMessage),

          firstUser.addChat(secondChat),
          thirdUser.addChat(secondChat),
          firstUser.addContact(thirdUser),
          thirdUser.addContact(firstUser), //
          thirdMessage.setChat(secondChat),
          fourthMessage.setChat(secondChat),
          firstUser.setMessage(fourthMessage),
          thirdUser.setMessage(thirdMessage),

          firstUser.addChat(thirdChat),
          fourthUser.addChat(thirdChat),
          firstUser.addContact(fourthUser),
          fourthUser.addContact(firstUser), //
          fifthMessage.setChat(thirdChat),
          sixthMessage.setChat(thirdChat),
          firstUser.setMessage(sixthMessage),
          fourthUser.setMessage(fifthMessage),

          firstUser.addChat(fourthChat),
          fifthUser.addChat(fourthChat),
          firstUser.addContact(fifthUser),
          fifthUser.addContact(firstUser), //
          seventhMessage.setChat(fourthChat),
          eighthMessage.setChat(fourthChat),
          firstUser.setMessage(eighthMessage),
          fifthUser.setMessage(seventhMessage),
        ]);
      },
    )
    .catch(error => console.log(error));
};

export default seed;
