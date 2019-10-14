import React, { Component, useState } from 'react';
import _ from 'lodash';
import { StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
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
  View,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
  Textarea,
} from 'native-base';

import CreateGroupModal from './CreateGroupModal';
import { GROUPS_QUERY } from '../graphql/queries';
import { CREATE_GROUP_MUTATION } from '../graphql/mutations';

const GroupsTab = props => {
  const { data, loading, error } = useQuery(GROUPS_QUERY, {
    variables: { userId: 1 },
  });

  const [createGroup, { ...mutationResult }] = useMutation(
    CREATE_GROUP_MUTATION,
  );

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { groups } = data;
  return (
    <>
      <List>
        {groups.map((group, index) => {
          return (
            <ListItem
              style={styles.listItem}
              avatar
              button
              key={index}
              onPress={() =>
                props.navigation.navigate('Chats', { chatId: group.id })
              }>
              <Left>
                <Thumbnail square source={{ uri: group.avatar }} />
              </Left>
              <Body>
                <Text>{group.name}</Text>
                <Text note numberOfLines={2} style={styles.lastMessage}>
                  {group.description}
                </Text>
              </Body>
              <Right>
                <Button
                  bordered
                  small
                  onPress={() =>
                    props.navigation.navigate('GroupDetails', {
                      groupId: group.id,
                    })
                  }>
                  <Text>Details</Text>
                </Button>
              </Right>
            </ListItem>
          );
        })}
      </List>
      <CreateGroupModal
        createGroup={createGroup}
        modal={props.modal}
        toggleModal={props.toggleModal}
      />
    </>
  );
};
const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
  },
  lastMessage: {},
});
export default GroupsTab;
