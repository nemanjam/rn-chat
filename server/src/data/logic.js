import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import Sequelize from 'sequelize';
import { MessageModel, UserModel, GroupModel, ChatModel } from './connectors';

const Op = Sequelize.Op;

// reusable function to check for a user with context
function getAuthenticatedUser(ctx) {
  return UserModel.findOne({ where: { id: 3 } });
  /*
  return ctx.user.then(user => {
    if (!user) {
      throw new AuthenticationError('Unauthenticated');
    }
    return user;
  });
  */
}
export const mutationLogic = {
  async createMessage(_, { text, chatId }, ctx) {
    const user = await getAuthenticatedUser(ctx);
    return MessageModel.create({
      userId: user.id,
      chatId,
      text,
    });
  },
};

export const queryLogic = {
  chat(_, args) {
    return ChatModel.findOne({ where: { id: args.chatId } });
  },
  async chats(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    return user.getChats();
  },
  group(_, args) {
    return GroupModel.findOne({ where: { id: args.groupId } });
  },
  async groups(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    return user.getGroups();
  },
  async users(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    const users = await UserModel.findAll({
      where: { id: { [Op.not]: user.id } },
    });
    return users;
  },
  async friends(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    return user.getFriends();
  },
  user(_, args, ctx) {
    return getAuthenticatedUser(ctx);
  },
};
