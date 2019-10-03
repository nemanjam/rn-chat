import React from 'react';
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
} from 'native-base';

const LoginScreen = props => {
  console.log(props);
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.openDrawer()}>
            <Icon name="ios-menu" />
          </Button>
        </Left>
        <Body>
          <Title>Login</Title>
        </Body>
        <Right />
      </Header>

      <Content padder>
        <Text>Content goes here (internal)</Text>
      </Content>

      <Footer>
        <FooterTab>
          <Button active full>
            <Text>Footer</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

export default LoginScreen;
