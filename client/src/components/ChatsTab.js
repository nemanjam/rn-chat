import React, { Component } from 'react';
import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

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
  Spinner,
} from 'native-base';

import { CHATS_QUERY } from '../graphql/queries';

const ChatsTab = props => {
  const { data, loading, error } = useQuery(CHATS_QUERY, {
    variables: { userId: 1 },
  });
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { chats } = data;
  return (
    <List>
      {chats.map((chat, index) => {
        return (
          <ListItem
            style={styles.listItem}
            avatar
            button
            key={index}
            onPress={() =>
              props.navigation.navigate('Chats', { chatId: chat.id })
            }>
            <Left>
              <Thumbnail source={{ uri: chat.users[0].avatar }} />
            </Left>
            <Body>
              <Text>{chat.users[0].username}</Text>
              <Text note numberOfLines={2} style={styles.lastMessage}>
                {chat.lastMessage.text}
              </Text>
            </Body>
            <Right>
              <Text note>
                {moment(chat.lastMessage.createdAt).format('LT')}
              </Text>
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
  lastMessage: {},
});
export default ChatsTab;
