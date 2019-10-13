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
    groups: [Group]
    contacts: [User]
    lastActiveAt: Date
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
    name: String!
    avatar: String
    description: String
    messages: [Message]
    users: [User]!
    lastMessage: Message
    createdAt: Date!
    updatedAt: Date!
  }

  type Message {
    id: Int!
    from: User!
    text: String!
    createdAt: Date!
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
  }

  type Subscription {
    messageAdded(chatId: Int): Message
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
export default typeDefs;
