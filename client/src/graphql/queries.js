import gql from 'graphql-tag';

export const CONTACTS_QUERY = gql`
  query ContactsQuery($id: Int!) {
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
  query ChatsQuery($userId: Int!) {
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

export const USER_QUERY = gql`
  query UserQuery($id: Int!) {
    user(id: $id) {
      id
      email
      username
      avatar
      description
      isActive
      lastActiveAt
    }
  }
`;

export const CHAT_QUERY = gql`
  query ChatQuery($id: Int!) {
    chat(id: $id) {
      id
      createdAt
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
`;
