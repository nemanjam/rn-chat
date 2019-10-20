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
  Spinner,
} from 'native-base';

import { CREATE_MESSAGE_MUTATION } from '../graphql/mutations';
import { MESSAGE_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';
import { GROUP_QUERY } from '../graphql/queries';

const ChatsScreen = props => {
  const groupId = props.navigation.getParam('groupId');

  const [createMessage, { ...mutationResult }] = useMutation(
    CREATE_MESSAGE_MUTATION,
  );

  const { subscribeToMore, ...queryResult } = useQuery(GROUP_QUERY, {
    variables: { groupId },
  });

  useEffect(() => {
    if (!queryResult.loading) subscribeToNewMesages();
  }, [queryResult.loading]);

  //mora loading return tu
  if (queryResult.loading) return <Spinner />;
  if (queryResult.error)
    return <Text>{JSON.stringify(queryResult.error, null, 2)}</Text>;

  function subscribeToNewMesages() {
    subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      variables: {
        groupId: queryResult.data.group.id,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newMessage = subscriptionData.data.messageAdded;
        const result = {
          ...previous,
          group: {
            ...previous.group,
            chat: {
              ...previous.group.chat,
              messages: [newMessage, ...previous.group.chat.messages],
            },
          },
        };
        return result;
      },
    });
  }
  async function onSend(messages) {
    const userId = messages[0].user._id;
    const text = messages[0].text;

    await createMessage({
      variables: { userId, groupId: queryResult.data.group.id, text },
    });
  }

  const { group } = queryResult.data;

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>
            {group.name === 'default'
              ? group.chat.users[1].username
              : group.name}
          </Title>
        </Body>
        <Right />
      </Header>
      <GiftedChat
        onSend={messages => onSend(messages)}
        user={{
          _id: props.auth.user.id,
        }}
        messages={(idx(queryResult, _ => _.data.group.chat.messages) || []).map(
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
