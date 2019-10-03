import React, {Component} from 'react';
import _ from 'lodash';
import {TouchableOpacity} from 'react-native';
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
            avatar
            button
            key={index}
            onPress={() => props.navigation.navigate('Chats')}>
            <Left>
              <Thumbnail source={{uri: 'https://i.pravatar.cc/100'}} />
            </Left>
            <Body>
              <Text>Kumar Pratik</Text>
              <Text note>
                Doing what you like will always keep you happy . .
              </Text>
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

export default Chats;
