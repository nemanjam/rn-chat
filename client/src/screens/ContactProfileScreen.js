import React from 'react';
import {ScrollView} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Form,
  Item,
  Label,
  Input,
  Grid,
  Row,
  Col,
} from 'native-base';

import Profile from '../components/Profile';

const LoginScreen = props => {
  console.log(props);
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Contact Profile</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Profile />
      </Content>
    </Container>
  );
};

export default LoginScreen;
