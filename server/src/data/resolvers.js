import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';
import { withFilter, ApolloError } from 'apollo-server';
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
const DEFAULT_GROUP_ADDED_TOPIC = 'defaultGroupAdded';

const Op = Sequelize.Op;

export const resolvers = {
  Date: GraphQLDate,

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        async (payload, args) => {
          const group = await GroupModel.findOne({
            where: { id: args.groupId },
          });
          const chat = await group.getChat();
          return Boolean(chat.id === payload.messageAdded.chatId);
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
    defaultGroupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(DEFAULT_GROUP_ADDED_TOPIC),
        (payload, args) => {
          console.log(JSON.stringify(payload, null, 2));
          return Boolean(
            true /*args.userId === payload.defaultGroupAdded.userId*/,
          );
        },
      ),
    },
  },

  Mutation: {
    async addUserToGroup(_, { groupId, userId }, ctx) {
      const group = await GroupModel.findOne({
        where: { id: groupId },
      });
      const user = await UserModel.findOne({
        where: { id: userId },
      });
      const chat = await group.getChat();
      await user.addChat(chat);
      await user.addGroup(group);
      return user;
    },
    async removeUserFromGroup(_, { groupId, userId }, ctx) {
      //move to logic
      const group = await GroupModel.findOne({
        where: { id: groupId },
      });
      if (group.ownerId === userId)
        throw new ApolloError('owner can delete but not leave group', 404);

      const users = await group.getUsers();
      const isInTheUsers = users.map(user => user.id).includes(userId);

      if (!isInTheUsers) throw new ApolloError('user is not in the group', 404);

      const user = await UserModel.findOne({
        where: { id: userId },
      });
      const chat = await group.getChat();
      await user.removeChat(chat);
      await user.removeGroup(group);
      return user;
    },
    async createDefaultGroup(_, { userId, contactId }, ctx) {
      //alredy in default group
      const existingDefaultGroup = await db.query(
        `(SELECT g.id FROM groups g, users u, "GroupUser" gu
          where g.id = gu."groupId" and u.id = gu."userId" 
          and g.name = 'default' and u.id = :userId)
          intersect
          (SELECT g.id FROM groups g, users u, "GroupUser" gu
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
      await contact.addGroup(group); //
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
    async createMessage(_, { userId, groupId, text }) {
      //treba default group id mesto chat id
      const group = await GroupModel.findOne({ where: { id: groupId } });
      const chat = await group.getChat();
      const message = await MessageModel.create({
        userId,
        chatId: chat.id,
        text,
      });
      pubsub.publish(DEFAULT_GROUP_ADDED_TOPIC, {
        [DEFAULT_GROUP_ADDED_TOPIC]: group,
      });
      pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
      return message;
    },
    async createGroup(_, { group }) {
      const owner = await UserModel.findOne({ where: { id: group.ownerId } });
      const chat = await ChatModel.create({});
      const _group = await GroupModel.create({
        name: group.name,
        avatar: group.avatarUrl,
        description: group.description,
        isPrivate: group.isPrivate,
      });

      await owner.addGroup(_group);
      await _group.setOwner(owner);
      await chat.setGroup(_group);

      pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: _group });
      return _group;
    },
    async editGroup(_, { group, groupId }) {
      const _group = await GroupModel.findOne({
        where: { id: groupId },
      });

      _group.name = group.name;
      _group.avatar = group.avatarUrl;
      _group.description = group.description;
      _group.isPrivate = group.isPrivate;
      await _group.save();
      return _group;
    },
    async deleteGroup(_, { groupId }) {
      const group = await GroupModel.findOne({
        where: { id: groupId },
      });

      const users = await group.getUsers();
      const bannedUsers = await group.getBannedUsers();
      const chat = await group.getChat();
      await group.removeBannedUsers(bannedUsers);
      await group.removeUsers(users);
      await chat.destroy();
      await group.destroy();
      return group;
    },
  },
  Query: {
    chat(_, args, ctx) {
      return queryLogic.chat(_, args, ctx);
    },
    async chats(_, args, ctx) {
      return queryLogic.chats(_, args, ctx);
    },
    group(_, args, ctx) {
      return queryLogic.group(_, args, ctx);
    },
    async groups(_, args, ctx) {
      return queryLogic.groups(_, args, ctx);
    },
    async allGroups(_, args, ctx) {
      return queryLogic.allGroups(_, args, ctx);
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
      return group.getOwner();
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
