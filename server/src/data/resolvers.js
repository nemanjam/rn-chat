import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';
import { withFilter } from 'apollo-server';
import { ChatModel, MessageModel, UserModel, GroupModel } from './connectors';
import { pubsub } from './subscriptions';
// connectori su orm mapiranja, a resolveri su orm upiti mapiranja na graphql
// Group, Message, User sequelize modeli tabele
//
const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'groupAdded';
const Op = Sequelize.Op;

export const resolvers = {
  Date: GraphQLDate,
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args) => {
          return Boolean(args.chatId === payload.messageAdded.chatId);
        },
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args) => {
          // console.log(JSON.stringify(payload, null, 2));
          return Boolean(true /*args.userId === payload.groupAdded.userId*/);
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
    createGroup(_, { group }) {
      return Promise.all([
        UserModel.findOne({ where: { id: group.ownerId } }),
        ChatModel.create({}),
        GroupModel.create({
          name: group.name,
          avatar: group.avatarUrl,
          description: group.description,
        }),
      ])
        .then(([owner, chat, _group]) => {
          return Promise.all([
            owner.addGroup(_group),
            owner.setGroup(_group),
            chat.setGroup(_group),
          ]);
        })
        .then(([groupUser, _group, chats]) => {
          pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: _group });
          return _group;
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
      return user.getChats();
    },
    group(_, args) {
      return GroupModel.findOne({ where: { id: args.groupId } });
    },
    async groups(_, args) {
      const user = await UserModel.findOne({ where: { id: args.userId } });
      return user.getGroups();
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

  Chat: {
    users(chat) {
      return chat.getUsers(); //sortiraj prema created at message, pa current user na kraj
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
  Group: {
    users(group) {
      return group.getUsers();
    },
    bannedUsers(group) {
      return group.getBannedUsers();
    },
    owner(group) {
      return group.getUser();
    },
    chat(group) {
      return group.getChat();
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
    friends(user) {
      return user.getFriends();
    },
    groups(user) {
      return user.getGroups();
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
/*
    async createGroup(_, { group }) {
      const owner = await UserModel.findOne({ where: { id: group.ownerId } });
      const chat = await ChatModel.create({});
      const _group = await GroupModel.create({
        name: group.name,
        avatar: group.avatarUrl,
        description: group.description,
      });
      await owner.addGroup(_group);
      await owner.setGroup(_group);
      await chat.setGroup(_group);
      pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: _group });
      return _group;
    },
*/
