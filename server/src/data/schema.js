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
    isPrivate: Boolean
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
    isPrivate: Boolean!
  }

  type Query {
    user(email: String, id: Int): User
    users(id: Int!): [User]
    friends(id: Int!): [User]
    chat(chatId: Int!): Chat
    chats(userId: Int!): [Chat]
    group(groupId: Int!): Group
    groups(userId: Int!): [Group]
    allGroups: [Group]
    chatGroups(userId: Int!): [Group]
  }

  type Mutation {
    createMessage(userId: Int!, groupId: Int!, text: String!): Message
    login(email: String!, password: String!): User
    register(username: String!, email: String!, password: String!): User
    createDefaultGroup(userId: Int!, contactId: Int!): Group
    createGroup(group: CreateGroupInput!): Group
    editGroup(groupId: Int!, group: CreateGroupInput!): Group
    addUserToGroup(groupId: Int!, userId: Int!): User
    removeUserFromGroup(groupId: Int!, userId: Int!): User
    deleteGroup(groupId: Int!): Group
  }

  type Subscription {
    messageAdded(groupId: Int!): Message
    groupAdded(userId: Int!): Group
    defaultGroupAdded(userId: Int!): Group
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
export default typeDefs;
