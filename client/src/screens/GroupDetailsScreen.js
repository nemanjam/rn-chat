import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Card,
  CardItem,
  Spinner,
  Thumbnail,
  Footer,
  FooterTab,
  Tabs,
  Tab,
  Toast,
} from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import CreateGroupModal from '../components/CreateGroupModal';

import { GROUP_QUERY, USERS_QUERY } from '../graphql/queries';
import {
  ADD_USER_TO_GROUP_MUTATION,
  REMOVE_USER_FROM_GROUP_MUTATION,
} from '../graphql/mutations';

const GroupDetailsScreen = props => {
  const groupId = props.navigation.getParam('groupId');
  const [modal, setModal] = useState(false);
  const [tabs, setTabs] = useState([true, false]);

  const { ...groupQueryResult } = useQuery(GROUP_QUERY, {
    variables: { groupId },
  });

  const { subscribeToMore, ...usersQueryResult } = useQuery(USERS_QUERY, {
    variables: { id: props.auth.user.id },
  });

  const [addUserToGroup, { ...mutationAddUserToGroupResult }] = useMutation(
    ADD_USER_TO_GROUP_MUTATION,
    {
      update(cache, { data }) {
        const { group } = cache.readQuery({
          query: GROUP_QUERY,
          variables: { groupId },
        });
        const newUser = data.addUserToGroup;
        const newUsers = [...group.users, newUser];
        const result = { group: { ...group, users: newUsers } };
        cache.writeQuery({
          query: GROUP_QUERY,
          data: result,
        });
      },
    },
  );

  const [removeUserFromGroup, { ...mutationRemoveUserFromGroup }] = useMutation(
    REMOVE_USER_FROM_GROUP_MUTATION,
    {
      update(cache, { data }) {
        const { group } = cache.readQuery({
          query: GROUP_QUERY,
          variables: { groupId },
        });
        const newUser = data.removeUserFromGroup;
        console.log(newUser);
        const newUsers = group.users.filter(user => user.id !== newUser.id);
        const result = { group: { ...group, users: newUsers } };
        cache.writeQuery({
          query: GROUP_QUERY,
          data: result,
        });
      },
    },
  );

  const loading = groupQueryResult.loading || usersQueryResult.loading;
  // mutationAddUserToGroupResult.loading ||
  // mutationRemoveUserFromGroup.loading;

  const error =
    groupQueryResult.error ||
    usersQueryResult.error ||
    mutationAddUserToGroupResult.error ||
    mutationRemoveUserFromGroup.error;

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  function isUserInGroup(group, userId) {
    return group.users.map(user => user.id).includes(userId);
  }

  async function addUserToGroupPress(group, userId) {
    if (!isUserInGroup(group, userId)) {
      const { data } = await addUserToGroup({
        variables: { groupId: group.id, userId },
      });
      Toast.show({
        text: `${data.addUserToGroup.username} added to the group.`,
        buttonText: 'Ok',
        duration: 3000,
        type: 'success',
      });
    } else {
      const { data } = await removeUserFromGroup({
        variables: { groupId: group.id, userId },
      });
      Toast.show({
        text: `${data.removeUserFromGroup.username} removed from the group.`,
        buttonText: 'Ok',
        duration: 3000,
        type: 'success',
      });
    }
  }

  function toggleModal() {
    setModal(!modal);
  }
  function toggleTab1() {
    setTabs([true, false]);
  }
  function toggleTab2() {
    setTabs([false, true]);
  }
  const { users } = usersQueryResult.data;
  const { group } = groupQueryResult.data;

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{group.name}</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Card style={styles.card}>
          <CardItem>
            <Body>
              <Image source={{ uri: group.avatar }} style={styles.image} />
            </Body>
          </CardItem>
          <CardItem>
            <Text style={styles.ownerText}>Owner: {group.owner.username}</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text style={styles.description}>{group.description}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Left>
              <Button small bordered onPress={() => setModal(true)}>
                <Text>Edit</Text>
              </Button>
            </Left>
            <Right style={{ flex: 1 }}>
              <Button small bordered>
                <Text>Delete</Text>
              </Button>
            </Right>
          </CardItem>
          {tabs[0] && (
            <List>
              {users.map((user, index) => {
                return (
                  <ListItem style={styles.listItem} key={index} thumbnail>
                    <Left>
                      <Thumbnail source={{ uri: user.avatar }} />
                    </Left>
                    <Body>
                      <Text>{user.username}</Text>
                      <Text note numberOfLines={1}>
                        {user.description}
                      </Text>
                    </Body>
                    <Right>
                      <Button
                        small
                        bordered={!isUserInGroup(group, user.id)}
                        onPress={() => addUserToGroupPress(group, user.id)}>
                        <Text>
                          {isUserInGroup(group, user.id) ? 'Remove' : 'Add'}
                        </Text>
                      </Button>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          )}
          {tabs[1] && (
            <List>
              {group.users.map((user, index) => {
                return (
                  <ListItem style={styles.listItem} key={index}>
                    <Grid>
                      <Col size={1} style={styles.col}>
                        <Text style={{ alignSelf: 'flex-start' }}>
                          {user.username}
                        </Text>
                      </Col>
                      <Col size={1}>
                        <Button small bordered style={styles.removeBanButton}>
                          <Text>Remove</Text>
                        </Button>
                      </Col>
                      <Col size={1}>
                        <Button small bordered style={styles.removeBanButton}>
                          <Text>Ban</Text>
                        </Button>
                      </Col>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
      </Content>
      <Footer>
        <FooterTab>
          <Button active={tabs[0]} onPress={() => toggleTab1()}>
            <Text style={styles.tabText}>All Users</Text>
          </Button>
          <Button active={tabs[1]} onPress={() => toggleTab2()}>
            <Text style={styles.tabText}>Group Users</Text>
          </Button>
        </FooterTab>
      </Footer>
      <CreateGroupModal modal={modal} toggleModal={toggleModal} />
    </Container>
  );
};

const styles = StyleSheet.create({
  usernameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    height: 100,
    width: null,
    flex: 1,
    alignSelf: 'stretch',
  },
  tabText: {
    fontSize: 14,
  },
  removeBanButton: {
    alignSelf: 'flex-end',
  },
  col: { justifyContent: 'center' },
  ownerText: { fontWeight: 'bold' },
  description: { fontSize: 14 },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(GroupDetailsScreen);
