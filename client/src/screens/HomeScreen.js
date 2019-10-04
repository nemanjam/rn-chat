import React, {useState, useRef} from 'react';

import {
  Container,
  Drawer,
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
import SideBar from '../components/SideBar';
import Contacts from '../components/Contacts';
import Chats from '../components/Chats';
import Profile from '../components/Profile';

const HomeScreen = props => {
  const [tabs, setTabs] = useState([true, false, false]);
  const drawer = useRef(null);

  function openDrawer() {
    drawer.current._root.open();
  }
  function closeDrawer() {
    drawer.current._root.close();
  }

  function toggleTab1() {
    setTabs([true, false, false]);
  }
  function toggleTab2() {
    setTabs([false, true, false]);
  }
  function toggleTab3() {
    setTabs([false, false, true]);
  }

  function getContentComponent() {
    if (tabs[0]) return <Contacts {...props} />;
    if (tabs[1]) return <Chats {...props} />;
    if (tabs[2]) return <Profile {...props} />;
  }
  /*
netstat -aon | findstr PID
adb connect 127.0.0.1:62001

*/

  return (
    <Container>
      <Drawer
        ref={ref => {
          drawer.current = ref;
        }}
        content={<SideBar {...props} />}
        onClose={() => closeDrawer()}>
        {!tabs[2] && (
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
        )}

        <Content padder>{getContentComponent()}</Content>

        <Footer>
          <FooterTab>
            <Button active={tabs[0]} onPress={() => toggleTab1()}>
              <Icon active={tabs[0]} name="globe" />
              <Text>Contacts</Text>
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
