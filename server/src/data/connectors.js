import Sequelize from 'sequelize';
import { _ } from 'lodash';
import faker from 'faker';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: '../../db/db.sqlite',
  logging: false,
});

// tabele, osnovni tipovi od kojih su sacinjeni ostali iz graphql scheme

const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
  isActive: { type: Sequelize.BOOLEAN },
  lastActiveAt: { type: Sequelize.DATE },
  password: { type: Sequelize.STRING },
});

const ChatModel = db.define('chat', {
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
});

const MessageModel = db.define('message', {
  text: { type: Sequelize.TEXT },
  createdAt: { type: Sequelize.DATE },
});

UserModel.belongsToMany(ChatModel, { through: 'ChatUser' });
UserModel.belongsToMany(UserModel, { through: 'Contacts', as: 'contacts' });
UserModel.belongsTo(MessageModel);

MessageModel.belongsToMany(ChatModel, { through: 'ChatMessage' });
MessageModel.belongsTo(ChatModel);

ChatModel.belongsToMany(UserModel, { through: 'ChatUser' });

const CHATS = 4;
const USERS_PER_CHAT = 2;
const MESSAGES_PER_USER = 5;

faker.seed(123); // get consistent data every time we reload app

db.sync({ force: true }).then(() =>
  _.times(GROUPS, () =>
    GroupModel.create({
      name: faker.lorem.words(3),
    })
      .then(group =>
        _.times(USERS_PER_GROUP, () => {
          return group
            .createUser({
              email: faker.internet.email(),
              username: faker.internet.userName(),
              avatar: faker.internet.avatar(),
              description: faker.lorem.sentences(Math.random() * 3),
              password: faker.internet.password(),
            })
            .then(user => {
              console.log(
                '{email, username, password}',
                `{${user.email}, ${user.username}, ${user.password}}`,
              );
              _.times(MESSAGES_PER_USER, () =>
                MessageModel.create({
                  userId: user.id,
                  groupId: group.id,
                  text: faker.lorem.sentences(3),
                }),
              );
              return user;
            });
        }),
      )
      .then(userPromises => {
        // make users friends with all users in the group
        Promise.all(userPromises).then(users => {
          _.each(users, (current, i) => {
            _.each(users, (user, j) => {
              if (i !== j) {
                current.addContact(user);
              }
            });
          });
        });
      }),
  ),
);

const Chat = db.models.chat;
const Message = db.models.message;
const User = db.models.user;

export { Chat, Message, User };
