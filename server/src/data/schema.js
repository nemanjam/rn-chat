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
    contacts: [User]
    isActive: Boolean
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

  type Message {
    id: Int!
    from: User!
    text: String!
    createdAt: Date!
  }

  type Query {
    user(email: String, id: Int): User
    contacts(id: Int!): [User]
    chat(id: Int!): Chat
    chats(userId: Int!): [Chat]
  }

  type Mutation {
    createMessage(userId: Int!, chatId: Int!, text: String!): Message
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
export default typeDefs;
