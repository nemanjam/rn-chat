import Sequelize from 'sequelize';
import { _ } from 'lodash';
import seed from './seed';

const db = new Sequelize('postgres://postgres:root@localhost:5432/chat');

// tabele, osnovni tipovi od kojih su sacinjeni ostali iz graphql scheme

export const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
  isActive: { type: Sequelize.BOOLEAN },
  lastActiveAt: { type: Sequelize.DATE },
  password: { type: Sequelize.STRING },
});

export const ChatModel = db.define('chat', {
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
});

export const MessageModel = db.define('message', {
  text: { type: Sequelize.TEXT },
  createdAt: { type: Sequelize.DATE },
});

UserModel.belongsToMany(ChatModel, { through: 'ChatUser' });
UserModel.belongsToMany(UserModel, { through: 'Contacts', as: 'contacts' });
UserModel.belongsTo(MessageModel);

ChatModel.belongsToMany(UserModel, { through: 'ChatUser' });

MessageModel.belongsTo(ChatModel);
ChatModel.hasMany(MessageModel);

// db.sync({ force: true })
//   .then(() => seed())
//   .catch(error => console.log(error));
