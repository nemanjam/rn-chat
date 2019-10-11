import gql from 'graphql-tag';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onMessageAdded($chatId: Int) {
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
