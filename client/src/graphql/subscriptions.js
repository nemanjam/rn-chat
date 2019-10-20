import gql from 'graphql-tag';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onMessageAdded($groupId: Int!) {
    messageAdded(groupId: $groupId) {
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
      isPrivate
      owner {
        id
        username
      }
    }
  }
`;

export const DEFAULT_GROUP_ADDED_SUBSCRIPTION = gql`
  subscription defaultGroupAdded($userId: Int!) {
    defaultGroupAdded(userId: $userId) {
      id
      name
      chat {
        id
        createdAt
        updatedAt
        lastMessage {
          text
          createdAt
        }
        users {
          username
          avatar
        }
      }
    }
  }
`;
