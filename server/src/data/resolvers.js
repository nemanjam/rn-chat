import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';
import { withFilter } from 'apollo-server';
import { ChatModel, MessageModel, UserModel, GroupModel } from './connectors';
import { pubsub } from './subscriptions';
// connectori su orm mapiranja, a resolveri su orm upiti mapiranja na graphql
// Group, Message, User sequelize modeli tabele
//
const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_MESSAGE_ADDED_TOPIC = 'groupMessageAdded';
const Op = Sequelize.Op;

export const resolvers = {
  Date: GraphQLDate,
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args) => {
          // console.log(JSON.stringify(payload, null, 2));
          return Boolean(args.chatId === payload.messageAdded.chatId);
        },
      ),
    },
  },

  Mutation: {
    createMessage(_, { userId, chatId, text }) {
      return MessageModel.create({
        userId,
        chatId,
        text,
      }).then(message => {
        pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
        return message;
      });
    },

    async createChat(_, { userId, contactId }) {
      //check if users are in the chat already
      const usersChatIds = await ChatModel.findAll({
        attributes: ['id'],
        include: [
          {
            model: UserModel,
            through: {
              where: { userId },
            },
            where: { id: { [Op.not]: null } },
            attributes: [],
          },
        ],
      }).map(item => item.id);
      const contactsChatIds = await ChatModel.findAll({
        attributes: ['id'],
        include: [
          {
            model: UserModel,
            through: {
              where: { userId: contactId },
            },
            where: { id: { [Op.not]: null } },
            attributes: [],
          },
        ],
      }).map(item => item.id);
      const chatIdExists = usersChatIds.filter(value =>
        contactsChatIds.includes(value),
      );

      // console.log(JSON.stringify(usersChatIds));
      // console.log(JSON.stringify(contactsChatIds));
      // console.log(JSON.stringify(chatIdExists));
      if (chatIdExists.length > 0)
        return await ChatModel.findOne({ where: { id: chatIdExists[0] } });

      const chat = await ChatModel.create({});
      const user = await UserModel.findOne({ where: { id: userId } });
      const contact = await UserModel.findOne({ where: { id: contactId } });
      const message = await MessageModel.create({
        text: 'Hello, I would like to start conversation.',
      });
      user.addChat(chat);
      contact.addChat(chat);
      message.setChat(chat);
      //add contact?
      user.addContact(contact);
      contact.addContact(user);
      return chat;
    },
  },
  // Query tip iz graphql scheme na dnu, jasno
  Query: {
    chat(_, args) {
      return ChatModel.findOne({ where: { id: args.chatId } });
    },
    async chats(_, args) {
      const user = await UserModel.findOne({ where: { id: args.userId } });
      return user.getChats({ where: { name: { [Op.eq]: null } } });
    },
    async groups(_, args) {
      const user = await UserModel.findOne({ where: { id: args.userId } });
      return user.getChats({ where: { name: { [Op.not]: null } } });
    },
    async users(_, args) {
      const users = await UserModel.findAll({
        where: { id: { [Op.not]: args.id } },
      });
      return users;
    },
    async friends(_, args) {
      const user = await UserModel.findOne({ where: args });
      return user.getFriends();
    },
    user(_, args) {
      return UserModel.findOne({ where: args });
    },
  },
  //prouci apollo state
  //mutacija za chat
  //mutacija kreiraj chat, contact
  //paginacija za scroll, fetch more
  //subscribtions za chat i chats i contacts
  //auth
  //webrtc
  //accept, ignore chat request, block user
  //css za profile page, fab button start chat

  Message: {
    from(message) {
      return message.getUser();
    },
  },
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
      return user.getFriends();
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
