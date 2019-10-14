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
export const CREATE_GROUP_MESSAGE_MUTATION = gql`
  mutation createGroupMessage($userId: Int!, $groupId: Int!, $text: String!) {
    createGroupMessage(userId: $userId, groupId: $groupId, text: $text) {
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
