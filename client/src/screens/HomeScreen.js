import React, {useState, useRef} from 'react';

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
  Drawer,
} from 'native-base';
import SideBar from '../components/SideBar';
import Users from '../components/Users';
import Chats from '../components/Chats';
import Profile from '../components/Profile';

const HomeScreen = props => {
  const [tabs, setTabs] = useState([true, false, false]);
  const drawer = useRef(null);
  function toggleTab1() {
    setTabs([true, false, false]);
  }
  function toggleTab2() {
    setTabs([false, true, false]);
  }
  function toggleTab3() {
    setTabs([false, false, true]);
  }
  function openDrawer() {
    drawer.current._root.open();
  }
  function closeDrawer() {
    drawer.current._root.close();
  }

  function getContentComponent() {
    let ContentComponent = Users;
    if (tabs[0]) ContentComponent = Users;
    if (tabs[1]) ContentComponent = Chats;
    if (tabs[2]) ContentComponent = Profile;
    return <ContentComponent />;
  }

  return (
    <Container>
      <Drawer
        ref={ref => {
          drawer.current = ref;
        }}
        content={<SideBar />}
        onClose={() => closeDrawer()}>
        <Header>
          <Left>
            <Button transparent onPress={() => openDrawer()}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>{getContentComponent()}</Content>

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
      </Drawer>
    </Container>
  );
};

export default HomeScreen;
