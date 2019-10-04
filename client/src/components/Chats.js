import React, {Component} from 'react';
import _ from 'lodash';
import {StyleSheet} from 'react-native';
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
} from 'native-base';

const Chats = props => {
  return (
    <List>
      {_.range(5).map((item, index) => {
        return (
          <ListItem
            style={styles.listItem}
            avatar
            button
            key={index}
            onPress={() => props.navigation.navigate('Chats')}>
            <Left>
              <Thumbnail source={{uri: 'https://i.pravatar.cc/100'}} />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Doing what you like will</Text>
            </Body>
            <Right>
              <Text note>3:43 pm</Text>
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
});
export default Chats;
