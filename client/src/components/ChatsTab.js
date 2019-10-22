import React, { useEffect, Fragment } from 'react';
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

import { CHAT_GROUPS_QUERY } from '../graphql/queries';
import { MESSAGE_IN_GROUP_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';

const ChatsTab = props => {
  const { subscribeToMore, data, loading, error, refetch } = useQuery(
    CHAT_GROUPS_QUERY,
    {
      variables: { userId: props.auth.user.id },
    },
  );

  useEffect(() => {
    if (props.tab2) refetch();
  }, [props.tab2]);

  useEffect(() => {
    if (!loading) subscribeToNewChats();
  }, [loading]);

  function subscribeToNewChats() {
    subscribeToMore({
      document: MESSAGE_IN_GROUP_ADDED_SUBSCRIPTION,
      variables: {
        userId: props.auth.user.id,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newChatGroup = subscriptionData.data.messageInGroupAdded;

        //update or apend
        const isInTheGroups = previous.chatGroups.find(
          group => group.id === newChatGroup.id,
        );
        let groups;
        if (isInTheGroups) {
          groups = previous.chatGroups.map(group =>
            group.id === newChatGroup.id ? newChatGroup : group,
          );
        } else {
          groups = [newDefaultGroup, ...previous.chatGroups];
        }
        //obelezi css neprocitanu poruku
        const result = {
          ...previous,
          chatGroups: groups,
        };
        return result;
      },
    });
  }
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  const { chatGroups } = data;
  //console.log(chatGroups);
  //ako nema ni jednu poruku nemoj ni da ga renderujes
  return (
    <List>
      {chatGroups.map((group, index) => {
        const { chat } = group;
        let username, avatar, isGroup;
        if (group.name === 'default') {
          isGroup = false;
          if (chat.users.length > 1) {
            avatar = chat.users[1].avatar;
            username = chat.users[1].username;
          } else {
            avatar = chat.users[0].avatar;
            username = chat.users[0].username;
          }
        } else {
          isGroup = true;
          avatar = group.avatar;
          username = group.name;
        }
        return (
          <Fragment key={index}>
            {chat.lastMessage && (
              <ListItem
                style={styles.listItem}
                avatar
                button
                onPress={() =>
                  props.navigation.navigate('Chats', { groupId: group.id })
                }>
                <Left>
                  <Thumbnail
                    square={isGroup}
                    style={styles.thumb}
                    source={{ uri: avatar }}
                  />
                </Left>
                <Body style={styles.body}>
                  <Text>{username}</Text>
                  <Text note numberOfLines={1} style={styles.lastMessage}>
                    {chat.lastMessage.text}
                  </Text>
                </Body>
                <Right>
                  <Text note>
                    {moment(chat.lastMessage.createdAt).format('LT')}
                  </Text>
                </Right>
              </ListItem>
            )}
          </Fragment>
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
  thumb: { marginBottom: 10 },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(ChatsTab);
