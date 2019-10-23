import faker from 'faker';
import { UserModel, ChatModel, MessageModel, GroupModel } from './connectors';
import bcrypt from 'bcrypt';

const seed = async () => {
  try {
    const hash = await bcrypt.hash('123456', 10);
    const user1 = await UserModel.create({
      username: `firstUser`,
      email: `email@email.com`,
      avatar: faker.internet.avatar(),
      description: faker.lorem.sentences(3),
      password: hash,
      lastActiveAt: new Date(),
    });
    [...Array(15).keys()].map(async (index, i) => {
      const user2 = await UserModel.create({
        username: `user${index}`,
        email: `email${index}@email.com`,
        avatar: faker.internet.avatar(),
        description: faker.lorem.sentences(3),
        password: hash,
        lastActiveAt: new Date(),
      });
      const chat1 = await ChatModel.create({});
      const message1 = await MessageModel.create({
        text: faker.lorem.sentences(3),
      });
      const message2 = await MessageModel.create({
        text: faker.lorem.sentences(3),
      });
      const group1 = await GroupModel.create({
        name: `group${index}`,
        avatar: faker.internet.avatar(),
        description: faker.lorem.sentences(3),
        isPrivate: !!(index % 2), // 0,1
      });

      await group1.addUser(user1);
      await group1.addUser(user2);
      await group1.setOwner(user1);
      await message1.setChat(chat1);
      await message2.setChat(chat1);
      await message1.setUser(user1);
      await message2.setUser(user2);
      await chat1.setGroup(group1);
      await user1.addChat(chat1);
      await user2.addChat(chat1);

      if (index % 2) {
        await user1.addFriend(user2);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default seed;
