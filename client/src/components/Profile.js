import React, { Component } from 'react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { Image, StyleSheet } from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  List,
  ListItem,
  Spinner,
} from 'native-base';

import { USER_QUERY } from '../graphql/queries';

const Profile = props => {
  const { data, loading, error } = useQuery(USER_QUERY, {
    variables: { id: props.userId || 1 },
  });
  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { user } = data;
  return (
    <Card style={styles.card}>
      <CardItem style={styles.cardItem}>
        <Body>
          <Image source={{ uri: user.avatar }} style={styles.image} />
          <List>
            <ListItem style={styles.usernameBlock}>
              <Body>
                <Text style={styles.usernameText}>{user.username}</Text>

                <Text style={styles.timeAgo}>{`• ${moment(
                  user.lastActiveAt,
                ).fromNow()}`}</Text>
              </Body>
              <Right>
                <Button style={styles.friendButton}>
                  <Text style={styles.buttonText}>Add As Friend</Text>
                </Button>
              </Right>
            </ListItem>
            <ListItem>
              <Text>{user.description}</Text>
            </ListItem>
          </List>
        </Body>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  usernameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    height: 300,
    width: null,
    flex: 1,
    alignSelf: 'stretch',
  },
  card: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 20,
  },
  cardItem: {
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
  },
  timeAgo: {
    fontSize: 12,
    color: 'green',
  },

  buttonText: {},
  friendButton: {
    width: 140,
  },
});

export default Profile;
