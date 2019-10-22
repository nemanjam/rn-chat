import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { useQuery } from '@apollo/react-hooks';
import { StyleSheet } from 'react-native';

import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  Spinner,
  Content,
} from 'native-base';

import { USERS_QUERY, PAGINATED_USERS_QUERY } from '../graphql/queries';

const UsersTab = props => {
  const { data, loading, error, refetch } = useQuery(USERS_QUERY, {
    variables: { id: props.auth.user.id },
  });
  /*
  const { ...puqr } = useQuery(PAGINATED_USERS_QUERY, {
    variables: { userConnection: { first: 4 } },
  });

  useEffect(() => {
    if (puqr.loading) return;
    puqr.fetchMore({
      variables: {
        userConnection: {
          after:
            puqr.data.paginatedUser.edges[
              puqr.data.paginatedUser.edges.length - 1
            ].cursor,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        console.log(previousResult);
        console.log(fetchMoreResult);
      },
    });
  }, [props.page]);
*/
  useEffect(() => {
    if (props.tab0) {
      refetch();
    }
  }, [props.tab0]);

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { users } = data;
  return (
    <List>
      {users.map((user, index) => {
        return (
          <ListItem
            style={styles.listItem}
            key={index}
            thumbnail
            button
            onPress={() =>
              props.navigation.navigate('UserProfile', {
                userId: user.id,
              })
            }>
            <Left>
              <Thumbnail source={{ uri: user.avatar }} />
            </Left>
            <Body>
              <Text>{user.username}</Text>
              <Text note numberOfLines={2}>
                {user.description}
              </Text>
            </Body>
          </ListItem>
        );
      })}
    </List>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
  },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(UsersTab);
