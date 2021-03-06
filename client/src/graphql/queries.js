import gql from 'graphql-tag';

export const FRIENDS_QUERY = gql`
  query FriendsQuery($id: Int!) {
    friends(id: $id) {
      id
      email
      username
      avatar
      description
    }
  }
`;

export const USERS_QUERY = gql`
  query UsersQuery($id: Int!) {
    users(id: $id) {
      id
      email
      username
      avatar
      description
    }
  }
`;

export const PAGINATED_USERS_QUERY = gql`
  query PaginatedUsersQuery($first: Int, $after: Int) {
    paginatedUsers(first: $first, after: $after) {
      edges {
        node {
          id
          email
          username
          avatar
          description
        }
      }
      pageInfo {
        cursor
        hasNextPage
      }
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
        createdAt
      }
      users {
        username
        avatar
      }
    }
  }
`;

export const GROUPS_QUERY = gql`
  query GroupsQuery($userId: Int!) {
    groups(userId: $userId) {
      id
      name
      avatar
      description
      isPrivate
    }
  }
`;

export const ALL_GROUPS_QUERY = gql`
  query AllGroupsQuery {
    allGroups {
      id
      name
      avatar
      description
      isPrivate
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
      lastActiveAt
    }
  }
`;

export const CHAT_QUERY = gql`
  query ChatQuery($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      createdAt
      updatedAt
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

export const GROUP_QUERY = gql`
  query GroupQuery($groupId: Int!) {
    group(groupId: $groupId) {
      id
      name
      avatar
      description
      isPrivate
      owner {
        id
        username
      }
      users {
        id
        username
        avatar
        description
        lastActiveAt
      }
      chat {
        id
        createdAt
        updatedAt
        users {
          username
          avatar
        }
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

export const CHAT_GROUPS_QUERY = gql`
  query chatGroupsQuery($userId: Int!) {
    chatGroups(userId: $userId) {
      id
      name
      avatar
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
