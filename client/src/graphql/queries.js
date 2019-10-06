import gql from 'graphql-tag';

export const CONTACTS_QUERY = gql`
  query contacts($id: Int!) {
    contacts(id: $id) {
      id
      email
      username
      avatar
      description
    }
  }
`;

export const CHATS_QUERY = gql`
  query chats($userId: Int!) {
    chats(userId: $userId) {
      id
      updatedAt
      lastMessage {
        text
      }
      users {
        username
        avatar
      }
    }
  }
`;
