import React, { Component, useState } from 'react';
import _ from 'lodash';
import { StyleSheet, Modal, TouchableHighlight } from 'react-native';
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
  View,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
  Textarea,
} from 'native-base';

import { GROUPS_QUERY } from '../graphql/queries';

const GroupsTab = props => {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(GROUPS_QUERY, {
    variables: { userId: 1 },
  });
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { groups } = data;
  return (
    <>
      <Button small style={styles.button} onPress={() => setModal(true)}>
        <Text>New Group</Text>
      </Button>
      <List>
        {groups.map((group, index) => {
          return (
            <ListItem
              style={styles.listItem}
              avatar
              button
              key={index}
              onPress={() =>
                props.navigation.navigate('GroupChats', { chatId: group.id })
              }>
              <Left>
                <Thumbnail source={{ uri: group.avatar }} />
              </Left>
              <Body>
                <Text>{group.name}</Text>
                <Text note numberOfLines={2} style={styles.lastMessage}>
                  {group.description}
                </Text>
              </Body>
              <Right>
                <Text note>
                  {moment(group.lastMessage.createdAt).format('LT')}
                </Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <Content contentContainerStyle={styles.content}>
          <Card>
            <CardItem header bordered>
              <Text>Create new group</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Form style={styles.form}>
                  <Item style={styles.input}>
                    <Input placeholder="Group Name" />
                  </Item>
                  <Item style={styles.input}>
                    <Input placeholder="Avatar url" />
                  </Item>
                  <Item style={styles.input} last>
                    <Input
                      multiline
                      numberOfLines={3}
                      placeholder="Description"
                    />
                  </Item>
                </Form>
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Left>
                <Button bordered small onPress={() => setModal(!modal)}>
                  <Text>Cancel</Text>
                </Button>
              </Left>
              <Right>
                <Button small onPress={() => setModal(!modal)}>
                  <Text>Create</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
  },
  lastMessage: {},
  button: {
    width: 120,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  form: {
    alignSelf: 'stretch',
    // backgroundColor: 'red',
    color: 'green',
  },
  input: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  textArea: {
    width: '100%',
  },
});
export default GroupsTab;
