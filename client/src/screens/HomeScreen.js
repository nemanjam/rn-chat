import React, {useState} from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Footer,
  FooterTab,
  Body,
  Left,
  Right,
  Icon,
  Text,
} from 'native-base';

const HomeScreen = props => {
  console.log(props);
  const [tabs, setTabs] = useState([true, false, false]);
  function toggleTab1() {
    setTabs([true, false, false]);
  }
  function toggleTab2() {
    setTabs([false, true, false]);
  }
  function toggleTab3() {
    setTabs([false, false, true]);
  }
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Home</Title>
        </Body>
        <Right />
      </Header>

      <Content padder>
        <Text>Content 1</Text>
      </Content>

      <Footer>
        <FooterTab>
          <Button active={tabs[0]} onPress={() => toggleTab1()}>
            <Icon active={tabs[0]} name="globe" />
            <Text>Users</Text>
          </Button>
          <Button active={tabs[1]} onPress={() => toggleTab2()}>
            <Icon active={tabs[1]} name="chatbubbles" />
            <Text>Chats</Text>
          </Button>
          <Button active={tabs[2]} onPress={() => toggleTab3()}>
            <Icon active={tabs[2]} name="contact" />
            <Text>Profile</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

export default HomeScreen;
