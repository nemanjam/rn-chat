import React, {Component} from 'react';
import _ from 'lodash';
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
} from 'native-base';

const Chats = () => {
  return (
    <List>
      {_.range(5).map((item, index) => {
        return (
          <ListItem key={index} avatar>
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
