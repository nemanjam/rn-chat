import React, { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';

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
  Segment,
} from 'native-base';
import SideBar from '../components/SideBar';
import UsersTab from '../components/UsersTab';
import ChatsTab from '../components/ChatsTab';
import Profile from '../components/Profile';
import FriendsTab from '../components/FriendsTab';

const HomeScreen = props => {
  const [tabs, setTabs] = useState([true, false, false]);
  const [segment, setSegment] = useState(0);
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
    if (tabs[0]) {
      if (segment === 0) return <UsersTab {...props} />;
      if (segment === 1) return <FriendsTab {...props} />;
    }
    if (tabs[1]) return <ChatsTab {...props} />;
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
          <Header hasTabs>
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

        {tabs[0] && (
          <Segment>
            <Button
              first
              active={segment === 0 ? true : false}
              onPress={() => setSegment(0)}>
              <Text>All</Text>
            </Button>
            <Button
              last
              active={segment === 1 ? true : false}
              onPress={() => setSegment(1)}>
              <Text>Friends</Text>
            </Button>
          </Segment>
        )}

        <Content padder>{getContentComponent()}</Content>

        <Footer>
          <FooterTab>
            <Button active={tabs[0]} onPress={() => toggleTab1()}>
              <Icon active={tabs[0]} name="globe" />
              <Text style={styles.tabText}>Users</Text>
            </Button>
            <Button active={tabs[0]} onPress={() => toggleTab1()}>
              <Icon active={tabs[0]} name="people" />
              <Text style={styles.tabText}>Groups</Text>
            </Button>
            <Button active={tabs[1]} onPress={() => toggleTab2()}>
              <Icon active={tabs[1]} name="chatbubbles" />
              <Text style={styles.tabText}>Chats</Text>
            </Button>
            <Button active={tabs[2]} onPress={() => toggleTab3()}>
              <Icon active={tabs[2]} name="contact" />
              <Text style={styles.tabText}>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Drawer>
    </Container>
  );
};

const styles = StyleSheet.create({
  tabText: {
    fontSize: 10,
  },
});

export default HomeScreen;
