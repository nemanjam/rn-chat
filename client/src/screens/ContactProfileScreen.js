import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Form,
  Item,
  Label,
  Input,
  Grid,
  Row,
  Col,
  Fab,
  View,
} from 'native-base';

import Profile from '../components/Profile';
import { CREATE_CHAT_MUTATION } from '../graphql/mutations';

const ContactProfileScreen = props => {
  const userId = props.navigation.getParam('userId');
  const [createChat, { ...mutationResult }] = useMutation(
    CREATE_CHAT_MUTATION,
    {
      onCompleted(data) {
        props.navigation.navigate('Chats', {
          chatId: data.createChat.id,
        });
      },
    },
  );
  const { error, loading } = mutationResult;

  function onFabPress() {
    createChat({ variables: { userId: 1, contactId: userId } });
  }
  if (loading) return <Text>Loading...</Text>;
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
          <Title>Contact Profile</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Profile userId={userId} />
      </Content>
      <Fab
        active={true}
        direction="up"
        style={{ backgroundColor: '#5067FF' }}
        position="bottomRight"
        onPress={() => onFabPress()}>
        <Icon name="chatboxes" />
      </Fab>
    </Container>
  );
};

export default ContactProfileScreen;
