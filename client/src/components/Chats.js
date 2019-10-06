import React, { Component } from 'react';
import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
} from 'native-base';

import { CHATS_QUERY } from '../graphql/queries';

const Chats = props => {
  const { data, loading, error } = useQuery(CHATS_QUERY, {
    variables: { userId: 1 },
  });
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { chats } = data;
  console.log(chats);
  return (
    <List>
      {chats.map((chat, index) => {
        return (
          <ListItem
            style={styles.listItem}
            avatar
            button
            key={index}
            onPress={() => props.navigation.navigate('Chats')}>
            <Left>
              <Thumbnail source={{ uri: chat.users[0].avatar }} />
            </Left>
            <Body>
              <Text>{chat.users[0].username}</Text>
              <Text note>{chat.lastMessage.text}</Text>
            </Body>
            <Right>
              <Text note>3:43 pm</Text>
            </Right>
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
export default Chats;
