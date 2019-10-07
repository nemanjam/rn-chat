import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

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

const ChatsScreen = props => {
  const [createMessage, { data, loading, error }] = useMutation(
    CREATE_MESSAGE_MUTATION,
  );

  function onSend(messages) {
    //console.log(messages);
    const userId = messages[0].user._id;
    const text = messages[0].text;

    createMessage({ variables: { userId, chatId: 1, text } });
  }

  console.log('data ', data);
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
        messages={[]}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
};

export default ChatsScreen;
