import gql from 'graphql-tag';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onMessageAdded($chatId: Int!) {
    messageAdded(chatId: $chatId) {
      id
      createdAt
      text
      from {
        id
        username
        avatar
      }
    }
  }
`;

export const GROUP_ADDED_SUBSCRIPTION = gql`
  subscription onGroupAdded($userId: Int!) {
    groupAdded(userId: $userId) {
      id
      name
      avatar
      description
      owner {
        id
        username
      }
    }
  }
`;
