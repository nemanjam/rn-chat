import React from 'react';
import _ from 'lodash';
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
} from 'native-base';

import { USERS_QUERY } from '../graphql/queries';

const UsersTab = props => {
  const { data, loading, error } = useQuery(USERS_QUERY, {
    variables: { id: 1 },
  });
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
export default UsersTab;
