import GraphQLDate from 'graphql-date';
import { ChatModel, MessageModel, UserModel } from './connectors';

// connectori su orm mapiranja, a resolveri su orm upiti mapiranja na graphql
// Group, Message, User sequelize modeli tabele
//

export const resolvers = {
  Date: GraphQLDate,
  // Query tip iz graphql scheme na dnu, jasno
  Query: {
    chat(_, args) {
      return ChatModel.findOne({ where: args });
    },
    async chats(_, args) {
      const user = await UserModel.findOne({ where: { id: args.userId } });
      return user.getChats();
    },
    async contacts(_, args) {
      const user = await UserModel.findOne({ where: args });
      return user.getContacts();
    },
    user(_, args) {
      return UserModel.findOne({ where: args });
    },
  },
  Chat: {
    users(chat) {
      return chat.getUsers();
    },
    messages(chat) {
      return MessageModel.findAll({
        where: { chatId: chat.id },
        order: [['createdAt', 'DESC']],
      });
    },
    lastMessage(chat) {
      return MessageModel.findOne({
        where: { chatId: chat.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Message: {
    from(message) {
      return message.getUser();
    },
  },
  User: {
    chats(user) {
      return user.getChats();
    },
    contacts(user) {
      return user.getContacts();
    },
  },
};

export default resolvers;
