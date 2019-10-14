import faker from 'faker';
import { UserModel, ChatModel, MessageModel, GroupModel } from './connectors';

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
    ChatModel.create({
      name: 'firstGroup',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
    }),
    ChatModel.create({
      name: 'secondGroup',
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
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

          firstUser.addChat(firstGroup),
          fourthUser.addChat(firstGroup),
          fifthMessage.setChat(firstGroup),
          sixthMessage.setChat(firstGroup),
          firstUser.setMessage(sixthMessage),
          fourthUser.setMessage(fifthMessage),

          firstUser.addChat(secondGroup),
          fifthUser.addChat(secondGroup),
          seventhMessage.setChat(secondGroup),
          eighthMessage.setChat(secondGroup),
          firstUser.setMessage(eighthMessage),
          fifthUser.setMessage(seventhMessage),
        ]);
      },
    )
    .catch(error => console.log(error));
};

export default seed;
