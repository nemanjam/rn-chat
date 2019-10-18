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

UserModel.belongsToMany(ChatModel, { through: 'ChatUser' });
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
MessageModel.belongsTo(UserModel);
UserModel.hasOne(MessageModel);

ChatModel.belongsToMany(UserModel, { through: 'ChatUser' });

MessageModel.belongsTo(ChatModel);
ChatModel.hasMany(MessageModel);

GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });
UserModel.belongsToMany(GroupModel, {
  through: 'BannedGroupUser',
  as: 'bannedUsers',
});
GroupModel.belongsTo(UserModel, {
  as: 'owner',
  foreignKey: 'ownerId',
  targetKey: 'id',
});
UserModel.hasOne(GroupModel, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
ChatModel.belongsTo(GroupModel);
GroupModel.hasOne(ChatModel);

// db.sync({ force: true })
//   .then(async () => await seed())
//   .catch(error => console.log(error));
