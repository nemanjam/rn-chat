import {gql} from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  type Group {
    id: Int!
    name: String
    users: [User]!
    messages: [Message]
  }

  # a user -- keep type really simple for now
  type User {
    id: Int!
    email: String!
    username: String
    messages: [Message]
    groups: [Group]
    friends: [User]
  }

  # a message sent from a user to a group
  type Message {
    id: Int!
    to: Group!
    from: User!
    text: String!
    createdAt: Date!
  }

  # query for types
  type Query {
    user(email: String, id: Int): User

    messages(groupId: Int, userId: Int): [Message]

    group(id: Int!): Group
  }

  schema {
    query: Query
  }
`;
export default typeDefs;
