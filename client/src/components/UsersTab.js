import React, { useEffect, useRef } from 'react';
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
  // const { data, loading, error, refetch } = useQuery(USERS_QUERY, {
  //   variables: { id: props.auth.user.id },
  // });

  const { ...puqr } = useQuery(PAGINATED_USERS_QUERY, {
    variables: { first: 5 },
  });

  useEffect(() => {
    if (puqr.loading || !puqr.data.paginatedUsers.pageInfo.hasNextPage) return;
    puqr.fetchMore({
      variables: {
        after: puqr.data.paginatedUsers.pageInfo.cursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.paginatedUsers.edges;
        const pageInfo = fetchMoreResult.paginatedUsers.pageInfo;
        if (!newEdges.length) return previousResult;
        const result = {
          paginatedUsers: {
            __typename: previousResult.paginatedUsers.__typename,
            edges: [...previousResult.paginatedUsers.edges, ...newEdges],
            pageInfo,
          },
        };
        // console.log('result', result);
        return result;
      },
    });
  }, [props.page]);

  useEffect(() => {
    if (props.tab0) {
      puqr.refetch({
        variables: { first: 5 },
      });
    }
  }, [props.tab0]);

  if (puqr.loading) return <Spinner />;
  if (puqr.error) return <Text>{JSON.stringify(puqr.error, null, 2)}</Text>;

  const users = puqr.data.paginatedUsers.edges.map(edge => edge.node);

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
