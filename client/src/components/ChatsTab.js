import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import idx from 'idx';

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

import { DEFAULT_GROUPS_QUERY } from '../graphql/queries';
import { DEFAULT_GROUP_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';

const ChatsTab = props => {
  const { subscribeToMore, data, loading, error } = useQuery(
    DEFAULT_GROUPS_QUERY,
    {
      variables: { userId: props.auth.user.id },
    },
  );

  useEffect(() => {
    if (!loading) subscribeToNewChats();
    console.log(loading);
  }, [loading]);

  function subscribeToNewChats() {
    subscribeToMore({
      document: DEFAULT_GROUP_ADDED_SUBSCRIPTION,
      variables: {
        userId: props.auth.user.id,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newDefaultGroup = subscriptionData.data.defaultGroupAdded;
        const result = {
          ...previous,
          defaultGroups: [newDefaultGroup, ...previous.defaultGroups],
        };
        console.log(previous);
        console.log(newDefaultGroup);
        console.log(result);
        return result;
      },
    });
  }
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  const { defaultGroups } = data;
  return (
    <List>
      {defaultGroups.map((group, index) => {
        const { chat } = group;
        return (
          <ListItem
            style={styles.listItem}
            avatar
            button
            key={index}
            onPress={() =>
              props.navigation.navigate('Chats', { groupId: group.id })
            }>
            <Left>
              <Thumbnail source={{ uri: chat.users[1].avatar }} />
            </Left>
            <Body style={styles.body}>
              <Text>{chat.users[1].username}</Text>
              <Text note numberOfLines={1} style={styles.lastMessage}>
                {idx(chat, _ => _.lastMessage.text) || ''}
              </Text>
            </Body>
            <Right>
              <Text note>
                {idx(chat, _ => moment(_.lastMessage.createdAt).format('LT')) ||
                  'never'}
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
  body: { alignSelf: 'stretch' },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(ChatsTab);
