import React, { Component } from 'react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { Image } from 'react-native';
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

import { USER_QUERY } from '../graphql/queries';

const Profile = props => {
  const { data, loading, error } = useQuery(USER_QUERY, {
    variables: { id: props.userId || 1 },
  });
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { user } = data;
  return (
    <Card style={{ flex: 0 }}>
      <CardItem>
        <Body>
          <Image
            source={{ uri: user.avatar }}
            style={{ height: 300, width: null, flex: 1, alignSelf: 'stretch' }}
          />
          <Text>{user.username}</Text>
          <Text>{user.isActive ? 'Active now' : 'Not active now'}</Text>
          <Text>{`Last actve: ${moment(user.lastActiveAt).fromNow(
            true,
          )}`}</Text>
          <Text>{user.description}</Text>
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Button>
            <Text>Have a chat</Text>
          </Button>
        </Left>
      </CardItem>
    </Card>
  );
};

export default Profile;
