import gql from 'graphql-tag';

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($userId: Int!, $chatId: Int!, $text: String!) {
    createMessage(userId: $userId, chatId: $chatId, text: $text) {
      id
      from {
        id
        username
      }
      createdAt
      text
    }
  }
`;

export const CREATE_CHAT_MUTATION = gql`
  mutation createChat($userId: Int!, $contactId: Int!) {
    createChat(userId: $userId, contactId: $contactId) {
      id
      users {
        id
        username
      }
    }
  }
`;

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      id
      name
      avatar
      description
      owner {
        id
        username
      }
      chat {
        messages {
          id
          text
          createdAt
          from {
            id
            username
            avatar
          }
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      email
      username
      avatar
      description
      jwt
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      avatar
      description
      jwt
    }
  }
`;

export const CREATE_DEFULT_GROUP_MUTATION = gql`
  mutation createDefaultGroup($userId: Int!, $contactId: Int!) {
    createDefaultGroup(userId: $userId, contactId: $contactId) {
      id
      chat {
        id
      }
      users {
        id
        username
      }
    }
  }
`;
