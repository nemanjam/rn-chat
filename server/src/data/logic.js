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
  return UserModel.findOne({ where: { id: 1 } });
  /*
  return ctx.user.then(user => {
    if (!user) {
      throw new AuthenticationError('Unauthenticated');
    }
    return user;
  });
  */
}

async function isUserAuth(userId, ctx) {
  const authUser = await getAuthenticatedUser(ctx);
  if (authUser.id !== userId) {
    throw new ForbiddenError('Unauthorized');
  }
  return authUser;
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
  async chat(_, args, ctx) {
    //if authUser belongs in that chat
    const authUser = await getAuthenticatedUser(ctx);
    const chatIds = await authUser
      .getChats({
        attributes: ['id'],
      })
      .map(chat => chat.id);
    console.log(JSON.stringify(chatIds, null, 2));
    const isInTheChat = chatIds.find(id => id === args.chatId);
    if (isInTheChat) {
      return ChatModel.findOne({ where: { id: args.chatId } });
    }
    throw new ForbiddenError('Unauthorized');
  },
  async chats(_, args, ctx) {
    const authUser = await isUserAuth(args.userId, ctx);
    return authUser.getChats();
  },
  async group(_, args, ctx) {
    //if authUser is in that group or not in banned array
    const authUser = await getAuthenticatedUser(ctx);
    const groupIds = await authUser
      .getGroups({
        attributes: ['id'],
      })
      .map(group => group.id);
    const isInTheGroup = groupIds.find(id => id === args.groupId);
    if (isInTheGroup) {
      return GroupModel.findOne({ where: { id: args.groupId } });
    }
    throw new ForbiddenError('Unauthorized');
  },
  async groups(_, args, ctx) {
    const authUser = await isUserAuth(args.userId, ctx);
    return authUser.getGroups();
  },
  async users(_, args, ctx) {
    const user = await getAuthenticatedUser(ctx);
    const users = UserModel.findAll({
      where: { id: { [Op.not]: user.id } },
    });
    return users;
  },
  async friends(_, args, ctx) {
    const authUser = await isUserAuth(args.id, ctx);
    return authUser.getFriends();
  },
  async user(_, args, ctx) {
    const authUser = await getAuthenticatedUser(ctx);
    if (authUser.id === args.id || authUser.email === args.email) {
      return authUser;
    }
    throw new ForbiddenError('Unauthorized');
  },
};

export const userLogic = {
  async chats(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getChats();
  },
  async friends(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getFriends();
  },
  async groups(user, args, ctx) {
    await isUserAuth(user.id, ctx);
    return user.getGroups();
  },
  jwt(user, args, ctx) {
    return Promise.resolve(user.jwt);
  },
};
