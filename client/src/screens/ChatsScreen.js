import React, { useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { GraphqlQueryControls, graphql, compose } from 'react-apollo';
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
  const [createMessage, { ...mutationResult }] = useMutation(
    CREATE_MESSAGE_MUTATION,
  );

  const { subscribeToMore, ...queryResult } = useQuery(CHAT_QUERY, {
    variables: { id: 1 },
  });

  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      variables: {
        id: props.navigation.getParam('userId'),
      },
      updateQuery: (previous, { subscriptionData }) => {
        console.log(subscriptionData);
      },
    });
  }, []);

  function onSend(messages) {
    //console.log(messages);
    const userId = messages[0].user._id;
    const text = messages[0].text;

    createMessage({ variables: { userId, chatId: 1, text } });
  }

  console.log('result ', queryResult);
  console.log('error ', JSON.stringify(queryResult.error, null, 2));

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
          _id: 2,
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

export default ChatsScreen;
