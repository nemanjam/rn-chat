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
export const GROUP_MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onGroupMessageAdded($groupId: Int) {
    groupMessageAdded(groupId: $groupId) {
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
