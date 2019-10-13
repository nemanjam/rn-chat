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

import { FRIENDS_QUERY } from '../graphql/queries';

const FriendsTab = props => {
  const { data, loading, error } = useQuery(FRIENDS_QUERY, {
    variables: { id: 1 },
  });
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { friends } = data;
  return (
    <List>
      {friends.map((friend, index) => {
        return (
          <ListItem
            style={styles.listItem}
            key={index}
            thumbnail
            button
            onPress={() =>
              props.navigation.navigate('UserProfile', {
                userId: friend.id,
              })
            }>
            <Left>
              <Thumbnail source={{ uri: friend.avatar }} />
            </Left>
            <Body>
              <Text>{friend.username}</Text>
              <Text note numberOfLines={2}>
                {friend.description}
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
export default FriendsTab;
