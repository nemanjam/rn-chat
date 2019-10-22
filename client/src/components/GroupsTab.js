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
  TabHeading,
} from 'native-base';

import CreateGroupModal from './CreateGroupModal';
import { GROUPS_QUERY, ALL_GROUPS_QUERY } from '../graphql/queries';
import { CREATE_GROUP_MUTATION } from '../graphql/mutations';
import { GROUP_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';

const GroupsTab = props => {
  const { ...myGroupsQueryResult } = useQuery(GROUPS_QUERY, {
    variables: { userId: props.auth.user.id },
  });

  const { ...allGroupsQueryResult } = useQuery(ALL_GROUPS_QUERY, {
    variables: {},
  });

  useEffect(() => {
    if (props.tab1) {
      //always first tab is selected on nav
      allGroupsQueryResult.refetch();
    }
  }, [props.tab1]);

  useEffect(() => {
    if (!myGroupsQueryResult.loading) subscribeToNewGroups();
  }, [myGroupsQueryResult.loading]);

  useEffect(() => {
    if (!allGroupsQueryResult.loading) subscribeToAllNewGroups();
  }, [allGroupsQueryResult.loading]);

  function subscribeToNewGroups() {
    myGroupsQueryResult.subscribeToMore({
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

  function subscribeToAllNewGroups() {
    allGroupsQueryResult.subscribeToMore({
      document: GROUP_ADDED_SUBSCRIPTION,
      variables: {
        userId: props.auth.user.id,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newGroup = subscriptionData.data.groupAdded;
        const result = {
          ...previous,
          allGroups: [newGroup, ...previous.allGroups],
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

  function tabChanged(tabNo) {
    if (tabNo === 0) allGroupsQueryResult.refetch();
    if (tabNo === 1) myGroupsQueryResult.refetch();
  }

  const { groups } = myGroupsQueryResult.data;
  const allGroups = allGroupsQueryResult.data.allGroups;

  return (
    <>
      <Tabs onChangeTab={({ i, ref, from }) => tabChanged(i)}>
        <Tab
          heading={
            <TabHeading>
              <Text style={styles.tabText}>ALL GROUPS</Text>
            </TabHeading>
          }>
          <List style={styles.list}>
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
        <Tab
          heading={
            <TabHeading>
              <Text style={styles.tabText}>MY GROUPS</Text>
            </TabHeading>
          }>
          <List style={styles.list}>
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
      <CreateGroupModal
        createGroup={createGroup}
        modal={props.modal}
        toggleModal={props.toggleModal}
      />
    </>
  );
};
const styles = StyleSheet.create({
  list: { marginLeft: 8 },
  listItem: {
    marginLeft: 0,
  },
  lastMessage: {},
  body: { alignSelf: 'stretch' },
  tabText: {
    fontSize: 12,
  },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(GroupsTab);
