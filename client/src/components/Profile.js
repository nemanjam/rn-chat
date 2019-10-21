import React, { Component } from 'react';
import { connect } from 'react-redux';

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
  Row,
  Col,
  Spinner,
  Content,
} from 'native-base';

import { USER_QUERY, FRIENDS_QUERY } from '../graphql/queries';

const Profile = props => {
  const { ...userQueryResult } = useQuery(USER_QUERY, {
    variables: { id: props.userId || props.auth.user.id }, //one is undefined
  });

  const { ...friendsQueryResult } = useQuery(FRIENDS_QUERY, {
    variables: { id: props.auth.user.id },
    skip: !props.userId,
  });

  function isFriend(friends, userId) {
    console.log(friends);
    console.log(userId);
    return friends.map(friend => friend.id).includes(userId);
  }

  const loading = userQueryResult.loading || friendsQueryResult.loading;
  const error = userQueryResult.error || friendsQueryResult.error;

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  const { user } = userQueryResult.data;
  const friends = friendsQueryResult.data
    ? friendsQueryResult.data.friends
    : [];

  return (
    <Card style={styles.card}>
      <CardItem style={styles.cardItem}>
        <Body>
          <Image source={{ uri: user.avatar }} style={styles.image} />
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Col>
            <Text style={styles.usernameText}>{user.username}</Text>
            <Text style={styles.timeAgo}>{`• ${moment(
              user.lastActiveAt,
            ).fromNow()}`}</Text>
          </Col>
        </Left>
        <Body />
        {props.userId && (
          <Right>
            <Button bordered small style={styles.friendButton}>
              <Text style={styles.buttonText}>
                {isFriend(friends, user.id) ? 'Unfriend' : 'Add As Friend'}
              </Text>
            </Button>
          </Right>
        )}
      </CardItem>
      <CardItem>
        <Text>{user.description}</Text>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  usernameText: {
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
  },

  buttonText: {},
  friendButton: {
    width: 140,
  },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(Profile);
