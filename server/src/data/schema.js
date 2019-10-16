import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  type User {
    id: Int!
    email: String!
    username: String
    avatar: String
    description: String
    chats: [Chat]
    friends: [User]
    groups: [Group]
    lastActiveAt: Date
    jwt: String
  }

  type Chat {
    id: Int!
    messages: [Message]
    users: [User]!
    lastMessage: Message
    createdAt: Date!
    updatedAt: Date!
  }

  type Group {
    id: Int!
    name: String
    avatar: String
    description: String
    owner: User
    users: [User]
    bannedUsers: [User]
    chat: Chat
    createdAt: Date!
    updatedAt: Date!
  }

  type Message {
    id: Int!
    from: User!
    text: String!
    createdAt: Date!
  }

  input CreateGroupInput {
    name: String!
    avatarUrl: String!
    description: String!
    ownerId: Int!
  }

  type Query {
    user(email: String, id: Int): User
    users(id: Int!): [User]
    friends(id: Int!): [User]
    chat(chatId: Int!): Chat
    chats(userId: Int!): [Chat]
    group(groupId: Int!): Group
    groups(userId: Int!): [Group]
  }

  type Mutation {
    createMessage(userId: Int!, chatId: Int!, text: String!): Message
    createChat(userId: Int!, contactId: Int!): Chat
    createGroup(group: CreateGroupInput!): Group
    login(email: String!, password: String!): User
    register(username: String!, email: String!, password: String!): User
  }

  type Subscription {
    messageAdded(chatId: Int): Message
    groupAdded(userId: Int): Group
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
export default typeDefs;