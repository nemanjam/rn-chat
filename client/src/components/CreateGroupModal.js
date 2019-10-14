import React, { useState } from 'react';
import { StyleSheet, Modal } from 'react-native';

import {
  Content,
  Left,
  Body,
  Right,
  Text,
  Button,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';

const CreateGroupModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <Content contentContainerStyle={styles.content}>
        <Card>
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
              <Button bordered small onPress={() => props.toggleModal()}>
                <Text>Cancel</Text>
              </Button>
            </Left>
            <Right>
              <Button small onPress={() => props.toggleModal()}>
                <Text>Submit</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </Content>
    </Modal>
  );
};
const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
    // backgroundColor: 'red',
    color: 'green',
  },
  input: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
export default CreateGroupModal;
