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
