import React from 'react';
import { AppRegistry, Image, StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon,
  Left,
  Badge,
  Right,
  View,
} from 'native-base';

import { logout } from '../store/actions/auth';

const SideBar = props => {
  return (
    <Container>
      <Content>
        <Image
          source={require('../assets/drawerBackground.jpg')}
          style={{
            height: 120,
            width: '100%',
            alignSelf: 'stretch',
            position: 'absolute',
          }}
        />
        <Image
          style={styles.avatar}
          source={{
            uri:
              'https://www.w3schools.com/w3images/avatar2.png' /*props.auth.user.avatar*/,
          }}
        />
        <View style={styles.view}>
          <Text style={styles.userText}>{props.auth.user.username}</Text>
          <Text style={styles.userText}>{props.auth.user.email}</Text>
        </View>
        <List style={styles.list}>
          <ListItem button onPress={() => {}}>
            <Left>
              <Icon active name="settings" style={styles.icon} />
              <Text style={styles.text}>Settings</Text>
            </Left>

            {/* <Right style={{ flex: 1 }}>
              <Badge
                style={{
                  borderRadius: 3,
                  height: 25,
                  width: 72,
                  backgroundColor: 'yellow',
                }}>
                <Text style={styles.badgeText}>Badge text</Text>
              </Badge>
            </Right> */}
          </ListItem>
          <ListItem button onPress={() => props.logout()}>
            <Left>
              <Icon active name="log-out" style={styles.icon} />
              <Text style={styles.text}>Logout</Text>
            </Left>
          </ListItem>
          <ListItem button onPress={() => props.navigation.navigate('Login')}>
            <Left>
              <Icon active name="log-in" style={styles.icon} />
              <Text style={styles.text}>Login</Text>
            </Left>
          </ListItem>
          <ListItem
            button
            onPress={() => props.navigation.navigate('Register')}>
            <Left>
              <Icon active name="log-in" style={styles.icon} />
              <Text style={styles.text}>Register</Text>
            </Left>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  badgeText: {
    fontSize: Platform.OS === 'ios' ? 13 : 11,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? -3 : undefined,
  },
  icon: {
    color: '#777',
    fontSize: 26,
    width: 30,
  },
  view: {
    position: 'absolute',
    alignSelf: 'flex-start',
    top: 160,
    left: 15,
  },
  userText: {
    color: '#777',
    fontSize: 13,
    fontWeight: '100',
  },
  text: {},
  avatar: {
    height: 100,
    width: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: 65,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 50,
  },
  list: { marginTop: 190 },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  { logout },
)(SideBar);
