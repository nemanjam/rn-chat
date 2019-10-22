import React from 'react';
import { connect } from 'react-redux';

import { useQuery, useMutation } from '@apollo/react-hooks';
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
import {
  ADD_FRIEND_MUTATION,
  REMOVE_FRIEND_MUTATION,
} from '../graphql/mutations';

const Profile = props => {
  const { ...userQueryResult } = useQuery(USER_QUERY, {
    variables: { id: props.userId || props.auth.user.id }, //one is undefined
  });

  const { ...friendsQueryResult } = useQuery(FRIENDS_QUERY, {
    variables: { id: props.auth.user.id },
    skip: !props.userId,
  });

  const [addFriend, { ...mutationAddFriendpResult }] = useMutation(
    ADD_FRIEND_MUTATION,
    {
      update(cache, { data }) {
        const { friends } = cache.readQuery({
          query: FRIENDS_QUERY,
          variables: { id: props.auth.user.id },
        });
        const newFriends = data.addFriend.friends;
        const result = { friends: [...newFriends] };
        cache.writeQuery({
          query: FRIENDS_QUERY,
          variables: { id: props.auth.user.id },
          data: result,
        });
      },
    },
  );

  const [removeFriend, { ...mutationremoveFriendpResult }] = useMutation(
    REMOVE_FRIEND_MUTATION,
    {
      update(cache, { data }) {
        const { friends } = cache.readQuery({
          query: FRIENDS_QUERY,
          variables: { id: props.auth.user.id },
        });
        const newFriends = data.removeFriend.friends;
        const result = { friends: [...newFriends] };
        cache.writeQuery({
          query: FRIENDS_QUERY,
          variables: { id: props.auth.user.id },
          data: result,
        });
      },
    },
  );

  async function toggleFriendPress(userId, friendId, isAdd) {
    if (isAdd) {
      await addFriend({
        variables: { userId, friendId },
      });
    } else {
      await removeFriend({
        variables: { userId, friendId },
      });
    }
  }

  function isFriend(friends, userId) {
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
        {props.userId && (
          <Right>
            <Button
              onPress={() =>
                toggleFriendPress(
                  props.auth.user.id,
                  props.userId,
                  !isFriend(friends, user.id),
                )
              }
              bordered
              small
              style={styles.friendButton}>
              <Text style={styles.buttonText}>
                {isFriend(friends, user.id) ? 'Unfriend' : 'Add Friend'}
              </Text>
            </Button>
          </Right>
        )}
      </CardItem>
      <CardItem>
        <Text style={styles.description}>{user.description}</Text>
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
  description: {
    fontSize: 14,
  },
  buttonText: {},
  friendButton: {},
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(Profile);
