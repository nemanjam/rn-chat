import gql from 'graphql-tag';

export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
      avatar
      description
    }
  }
`;

export const CONTACTS_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
    }
  }
`;
