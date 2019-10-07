import GraphQLDate from 'graphql-date';
import { ChatModel, MessageModel, UserModel } from './connectors';

// connectori su orm mapiranja, a resolveri su orm upiti mapiranja na graphql
// Group, Message, User sequelize modeli tabele
//

export const resolvers = {
  Date: GraphQLDate,
  Mutation: {
    createMessage(_, { userId, chatId, text }) {
      return MessageModel.create({
        userId,
        chatId,
        text,
      });
    },
  },
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
  //prouci apollo state
  //mutacija za chat
  //paginacija za scroll
  //subscribtions za chat i chats i contacts
  //auth
  //webrtc
  Chat: {
    users(chat) {
      // return chat.getUsers(); //sortiraj prema created at message, pa current user na kraj
      return UserModel.findAll({
        include: [
          {
            model: ChatModel,
            where: { id: chat.id },
            include: [
              {
                model: MessageModel,
              },
            ],
            order: [[MessageModel, 'userId', 'DESC']],
          },
        ],
      });
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

/*
   async createMessage(_, { userId, chatId, text }) {
      const chat = await ChatModel.findOne({ where: { id: chatId } });
      console.log(chat);
      const message = await MessageModel.create({
        from: userId,
        text,
        createdAt: new Date(),
      });
      chat.messages.push(message);
      chat.lastMessage = message;
      await chat.save();
      return message;
    },
*/
