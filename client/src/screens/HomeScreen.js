import React, { useState, useRef, useEffect, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

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
import GroupsTab from '../components/GroupsTab';
import Profile from '../components/Profile';
import FriendsTab from '../components/FriendsTab';

const HomeScreen = props => {
  const [tabs, setTabs] = useState([true, false, false, false]);
  const [segment, setSegment] = useState(0);
  const [modal, setModal] = useState(false);
  const drawer = useRef(null);

  useEffect(() => {
    if (_.isEmpty(props.auth.user)) {
      props.navigation.navigate('Login');
    }
  }, []);

  function openDrawer() {
    drawer.current._root.open();
  }
  function closeDrawer() {
    drawer.current._root.close();
  }

  function toggleTab1() {
    setTabs([true, false, false, false]);
  }
  function toggleTab2() {
    setTabs([false, true, false, false]);
  }
  function toggleTab3() {
    setTabs([false, false, true, false]);
  }
  function toggleTab4() {
    setTabs([false, false, false, true]);
  }

  function toggleModal() {
    setModal(!modal);
  }

  function getContentComponent() {
    if (tabs[0]) {
      if (segment === 0) return <UsersTab {...props} />;
      if (segment === 1) return <FriendsTab {...props} />;
    }
    if (tabs[1])
      return <GroupsTab toggleModal={toggleModal} modal={modal} {...props} />;
    if (tabs[2]) return <ChatsTab {...props} />;
    if (tabs[3]) return <Profile {...props} />;
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
        {!tabs[3] && (
          <Header hasTabs>
            <Left>
              <Button transparent onPress={() => openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              {tabs[0] ? (
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
              ) : tabs[1] ? (
                <Button
                  small
                  style={styles.button}
                  onPress={() => setModal(true)}>
                  <Text>New Group</Text>
                </Button>
              ) : (
                <Title></Title>
              )}
            </Body>
            <Right />
          </Header>
        )}

        <Content
          padder={tabs[0] || tabs[2]}
          contentContainerStyle={styles.content}>
          {getContentComponent()}
        </Content>

        <Footer>
          <FooterTab>
            <Button active={tabs[0]} onPress={() => toggleTab1()}>
              <Icon active={tabs[0]} name="globe" />
              <Text style={styles.tabText}>Users</Text>
            </Button>
            <Button active={tabs[1]} onPress={() => toggleTab2()}>
              <Icon active={tabs[1]} name="people" />
              <Text style={styles.tabText}>Groups</Text>
            </Button>
            <Button active={tabs[2]} onPress={() => toggleTab3()}>
              <Icon active={tabs[2]} name="chatbubbles" />
              <Text style={styles.tabText}>Chats</Text>
            </Button>
            <Button active={tabs[3]} onPress={() => toggleTab4()}>
              <Icon active={tabs[3]} name="contact" />
              <Text style={styles.tabText}>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Drawer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  tabText: {
    fontSize: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    marginRight: -50,
  },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(HomeScreen);
