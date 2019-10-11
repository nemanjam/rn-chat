import React, { useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/react-hooks';
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
    variables: { chatId: 1 },
  });

  const { data, error, loading } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: {
      chatId: 1,
    },
  });

  useEffect(() => {
    //subscribeToNewMesages();
  }, []);

  function subscribeToNewMesages() {
    subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      variables: {
        chatId: 1,
      },
      updateQuery: (previous, { subscriptionData }) => {
        console.log('previous ', previous);
        console.log('subscriptionData ', subscriptionData);
        if (!subscriptionData.data) return previous;
        const newMessage = subscriptionData.data.messageAdded;

        return {
          ...previous,
          messages: [...previous.messages, newMessage],
        };
      },
    });
  }
  function onSend(messages) {
    //console.log(messages);
    const userId = messages[0].user._id;
    const text = messages[0].text;

    createMessage({ variables: { userId, chatId: 1, text } });
  }

  console.log('data ', data);
  console.log('loading ', loading);
  console.log('error ', JSON.stringify(error, null, 2));

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
