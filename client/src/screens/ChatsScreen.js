import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { GiftedChat } from 'react-native-gifted-chat';
import { useMutation, useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import idx from 'idx';

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

import { CREATE_MESSAGE_MUTATION } from '../graphql/mutations';
import { MESSAGE_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';
import { CHAT_QUERY } from '../graphql/queries';

const ChatsScreen = props => {
  const chatId = props.navigation.getParam('chatId');

  const [createMessage, { ...mutationResult }] = useMutation(
    CREATE_MESSAGE_MUTATION,
  );

  const { subscribeToMore, ...queryResult } = useQuery(CHAT_QUERY, {
    variables: { chatId },
  });

  useEffect(() => {
    subscribeToNewMesages();
  }, []);

  function subscribeToNewMesages() {
    subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      variables: {
        chatId,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newMessage = subscriptionData.data.messageAdded;

        const result = {
          ...previous,
          chat: {
            ...previous.chat,
            messages: [newMessage, ...previous.chat.messages],
          },
        };
        return result;
      },
    });
  }
  function onSend(messages) {
    const userId = messages[0].user._id;
    const text = messages[0].text;

    createMessage({ variables: { userId, chatId, text } });
  }

  // console.log('queryResult ', queryResult.data);
  // console.log('error ', JSON.stringify(error, null, 2));

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Chats</Title>
        </Body>
        <Right />
      </Header>
      <GiftedChat
        onSend={messages => onSend(messages)}
        user={{
          _id: props.auth.user.id,
        }}
        messages={(idx(queryResult.data, _ => _.chat.messages) || []).map(
          message => {
            return {
              _id: message.id,
              text: message.text,
              createdAt: message.createdAt,
              user: {
                _id: message.from.id,
                name: message.from.username,
                avatar: message.from.avatar,
              },
            };
          },
        )}
      />
    </Container>
  );
};

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(ChatsScreen);
