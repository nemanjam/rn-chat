import React from 'react';
import { connect } from 'react-redux';

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
  Spinner,
} from 'native-base';

import Profile from '../components/Profile';
import { CREATE_DEFULT_GROUP_MUTATION } from '../graphql/mutations';

const UserProfileScreen = props => {
  const userId = props.navigation.getParam('userId');
  const [createDefaultGroup, { ...mutationResult }] = useMutation(
    CREATE_DEFULT_GROUP_MUTATION,
  );
  const { error, loading } = mutationResult;

  async function onFabPress() {
    const { data } = await createDefaultGroup({
      variables: { userId: props.auth.user.id, contactId: userId },
    });
    props.navigation.navigate('Chats', {
      groupId: data.createDefaultGroup.id,
    });
  }
  if (loading) return <Spinner />;
  if (error) alert(JSON.stringify(error, null, 2));
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>User Profile</Title>
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

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  null,
)(UserProfileScreen);
