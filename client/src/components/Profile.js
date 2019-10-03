import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
} from 'native-base';

const Profile = () => {
  return (
    <Card style={{flex: 0}}>
      <CardItem>
        <Body>
          <Image
            source={{uri: 'https://i.pravatar.cc/200'}}
            style={{height: 300, width: null, flex: 1, alignSelf: 'stretch'}}
          />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Text>
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Button transparent textStyle={{color: '#87838B'}}>
            <Icon name="logo-github" />
            <Text>1,926 stars</Text>
          </Button>
        </Left>
      </CardItem>
    </Card>
  );
};

export default Profile;
