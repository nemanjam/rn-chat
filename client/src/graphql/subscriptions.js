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

export const MESSAGE_IN_GROUP_ADDED_SUBSCRIPTION = gql`
  subscription messageInGroupAdded($userId: Int!) {
    messageInGroupAdded(userId: $userId) {
      id
      name
      chat {
        id
        createdAt
        updatedAt
        lastMessage {
          text
          createdAt
          from {
            id
            username
            avatar
          }
        }
        users {
          username
          avatar
        }
      }
    }
  }
`;
