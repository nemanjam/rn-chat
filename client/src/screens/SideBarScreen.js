import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
} from 'native-base';
import styles from './style';

const SideBarScreen = () => {
  return (
    <Container>
      <Content
        bounces={false}
        style={{flex: 1, backgroundColor: '#fff', top: -1}}>
        <Text>SideBarScreen</Text>
      </Content>
    </Container>
  );
};

export default SideBarScreen;
