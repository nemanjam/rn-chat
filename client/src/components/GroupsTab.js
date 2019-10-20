import React, { useEffect, useState, Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { StyleSheet } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';

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
  Tabs,
  Tab,
} from 'native-base';

import CreateGroupModal from './CreateGroupModal';
import { GROUPS_QUERY, ALL_GROUPS_QUERY } from '../graphql/queries';
import { CREATE_GROUP_MUTATION } from '../graphql/mutations';
import { GROUP_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';

const GroupsTab = props => {
  const { subscribeToMore, ...myGroupsQueryResult } = useQuery(GROUPS_QUERY, {
    variables: { userId: props.auth.user.id },
  });

  const { ...allGroupsQueryResult } = useQuery(ALL_GROUPS_QUERY, {
    variables: {},
  });

  useEffect(() => {
    if (!myGroupsQueryResult.loading) subscribeToNewGroups();
  }, [myGroupsQueryResult.loading]);

  function subscribeToNewGroups() {
    subscribeToMore({
      document: GROUP_ADDED_SUBSCRIPTION,
      variables: {
        userId: props.auth.user.id,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newGroup = subscriptionData.data.groupAdded;
        const result = {
          ...previous,
          groups: [newGroup, ...previous.groups],
        };
        return result;
      },
    });
  }

  const [createGroup, { ...mutationResult }] = useMutation(
    CREATE_GROUP_MUTATION,
  );

  const loading = myGroupsQueryResult.loading || allGroupsQueryResult.loading;
  const error = myGroupsQueryResult.error || allGroupsQueryResult.error;

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  const { groups } = myGroupsQueryResult.data;
  const allGroups = allGroupsQueryResult.data.allGroups;

  return (
    <>
      <Tabs>
        <Tab heading="All Groups">
          <List>
            {allGroups.map((group, index) => {
              return (
                <ListItem
                  key={index}
                  style={styles.listItem}
                  avatar
                  button
                  onPress={() =>
                    props.navigation.navigate('Chats', { groupId: group.id })
                  }>
                  <Left>
                    <Thumbnail square source={{ uri: group.avatar }} />
                  </Left>
                  <Body style={styles.body}>
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
        </Tab>
        <Tab heading="My Groups">
          <List>
            {groups.map((group, index) => {
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
                    <Thumbnail square source={{ uri: group.avatar }} />
                  </Left>
                  <Body style={styles.body}>
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
        </Tab>
      </Tabs>
      <Content padder contentContainerStyle={styles.content}>
        <CreateGroupModal
          createGroup={createGroup}
          modal={props.modal}
          toggleModal={props.toggleModal}
        />
      </Content>
    </>
  );
};
const styles = StyleSheet.create({
  content: { paddingTop: 0 },
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
)(GroupsTab);
