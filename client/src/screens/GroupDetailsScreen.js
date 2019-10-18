import React, { useState } from 'react';
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
} from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import CreateGroupModal from '../components/CreateGroupModal';

import { GROUP_QUERY, USERS_QUERY } from '../graphql/queries';

const GroupDetailsScreen = props => {
  const groupId = props.navigation.getParam('groupId');
  const [modal, setModal] = useState(false);
  const [tabs, setTabs] = useState([true, false]);

  const { ...groupQueryResult } = useQuery(GROUP_QUERY, {
    variables: { groupId },
  });

  const { ...usersQueryResult } = useQuery(USERS_QUERY, {
    variables: { id: props.auth.user.id },
  });

  if (groupQueryResult.loading) return <Spinner />;
  if (groupQueryResult.error)
    return <Text>{JSON.stringify(groupQueryResult.error, null, 2)}</Text>;

  if (usersQueryResult.loading) return <Spinner />;
  if (usersQueryResult.error)
    return <Text>{JSON.stringify(usersQueryResult.error, null, 2)}</Text>;

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
  // console.log(group);
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
            <Text>Owner: {group.owner.username}</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{group.description}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Left>
              <Button small bordered>
                <Text>Join</Text>
              </Button>
            </Left>
            <Body style={{ alignItems: 'center' }}>
              <Button small bordered onPress={() => setModal(true)}>
                <Text>Edit</Text>
              </Button>
            </Body>
            <Right style={{ flex: 1 }}>
              <Button small bordered>
                <Text>Delete</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
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
                    <Button small bordered>
                      <Text>Add</Text>
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
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(GroupDetailsScreen);
