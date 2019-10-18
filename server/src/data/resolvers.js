import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';
import { withFilter } from 'apollo-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import faker from 'faker';

import {
  ChatModel,
  MessageModel,
  UserModel,
  GroupModel,
  db,
} from './connectors';
import { pubsub } from './subscriptions';
import { JWT_SECRET } from '../config';
import { queryLogic, userLogic } from './logic';

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
    async createDefaultGroup(_, { userId, contactId }, ctx) {
      //alredy in default group
      const existingDefaultGroup = await db.query(
        `(SELECT g.id FROM groups g, users u, groupuser gu
          where g.id = gu."groupId" and u.id = gu."userId" 
          and g.name = 'default' and u.id = :userId)
          intersect
          (SELECT g.id FROM groups g, users u, groupuser gu
          where g.id = gu."groupId" and u.id = gu."userId" 
          and g.name = 'default' and u.id = :contactId)`,
        {
          replacements: { userId: userId, contactId: contactId },
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      if (existingDefaultGroup.length > 0) {
        return GroupModel.findOne({
          where: { id: existingDefaultGroup[0].id },
        });
      }

      //create chat
      const chat = await ChatModel.create({});
      const user = await UserModel.findOne({ where: { id: userId } });
      const contact = await UserModel.findOne({ where: { id: contactId } });
      await user.addChat(chat);
      await contact.addChat(chat);
      // create group
      const group = await GroupModel.create({ name: 'default' });
      await chat.setGroup(group);
      await user.addGroup(group);
      await contact.addGroup(group);
      return group;
    },
    login(_, { email, password }, ctx) {
      return UserModel.findOne({ where: { email } }).then(user => {
        if (user) {
          return bcrypt.compare(password, user.password).then(res => {
            if (res) {
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                },
                JWT_SECRET,
              );
              user.jwt = token;
              ctx.user = Promise.resolve(user);
              return user;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('email not found');
      });
    },
    register(_, { email, password, username }, ctx) {
      return UserModel.findOne({ where: { email } }).then(existing => {
        if (!existing) {
          return bcrypt
            .hash(password, 10)
            .then(hash =>
              UserModel.create({
                email,
                password: hash,
                username,
                avatar: faker.internet.avatar(),
                description: faker.lorem.sentences(3),
              }),
            )
            .then(user => {
              const { id } = user;
              const token = jwt.sign({ id, email }, JWT_SECRET);
              user.jwt = token;
              ctx.user = Promise.resolve(user);
              return user;
            });
        }
        return Promise.reject('email already exists'); // email already exists
      });
    },
    async createMessage(_, { userId, chatId, text }) {
      const message = await MessageModel.create({
        userId,
        chatId,
        text,
      });
      pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
      return message;
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
  Query: {
    chat(_, args, ctx) {
      return queryLogic.chat(_, args);
    },
    async chats(_, args, ctx) {
      return queryLogic.chats(_, args, ctx);
    },
    group(_, args, ctx) {
      return queryLogic.group(_, args);
    },
    async groups(_, args, ctx) {
      return queryLogic.groups(_, args, ctx);
    },
    async defaultGroups(_, args, ctx) {
      return queryLogic.defaultGroups(_, args, ctx);
    },
    async users(_, args, ctx) {
      return queryLogic.users(_, args, ctx);
    },
    async friends(_, args, ctx) {
      return queryLogic.friends(_, args, ctx);
    },
    user(_, args, ctx) {
      return queryLogic.user(_, args, ctx);
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
    chats(user, args, ctx) {
      return userLogic.chats(user, args, ctx);
    },
    friends(user, args, ctx) {
      return userLogic.friends(user, args, ctx);
    },
    groups(user, args, ctx) {
      return userLogic.groups(user, args, ctx);
    },
    jwt(user, args, ctx) {
      return userLogic.jwt(user, args, ctx);
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
/*
(SELECT g.id FROM groups g, users u, groupuser gu
where g.id = gu."groupId" and u.id = gu."userId" 
and g.name = 'default' and u.id = 1)
intersect
(SELECT g.id FROM groups g, users u, groupuser gu
where g.id = gu."groupId" and u.id = gu."userId" 
and g.name = 'default' and u.id = 3)
*/
