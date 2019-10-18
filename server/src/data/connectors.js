import Sequelize from 'sequelize';
import { _ } from 'lodash';
import seed from './seed';

export const db = new Sequelize(
  'postgres://postgres:root@localhost:5432/chat',
  {
    logging: false,
  },
);

// tabele, osnovni tipovi od kojih su sacinjeni ostali iz graphql scheme

export const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
  lastActiveAt: { type: Sequelize.DATE },
  password: { type: Sequelize.STRING },
});

export const ChatModel = db.define('chat', {});

export const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
});

export const MessageModel = db.define('message', {
  text: { type: Sequelize.TEXT },
});

UserModel.belongsToMany(ChatModel, { through: 'chatuser' });
UserModel.belongsToMany(UserModel, { through: 'friendstable', as: 'friends' });
MessageModel.belongsTo(UserModel);
UserModel.hasOne(MessageModel);

ChatModel.belongsToMany(UserModel, { through: 'chatuser' });

MessageModel.belongsTo(ChatModel);
ChatModel.hasMany(MessageModel);

GroupModel.belongsToMany(UserModel, { through: 'groupuser' });
UserModel.belongsToMany(GroupModel, { through: 'groupuser' });
UserModel.belongsToMany(GroupModel, {
  through: 'bannedgroupuser',
  as: 'bannedusers',
});
GroupModel.belongsTo(UserModel);
UserModel.hasOne(GroupModel);
ChatModel.belongsTo(GroupModel);
GroupModel.hasOne(ChatModel);

// db.sync({ force: true })
//   .then(async () => await seed())
//   .catch(error => console.log(error));
