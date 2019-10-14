import React, { useEffect } from 'react';
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
  Spinner,
} from 'native-base';

import { CREATE_GROUP_MESSAGE_MUTATION } from '../graphql/mutations';
import { GROUP_MESSAGE_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';
import { GROUP_QUERY } from '../graphql/queries';

const GroupChatsScreen = props => {
  const groupId = props.navigation.getParam('groupId');
  console.log(groupId);
  const [createGroupMessage, { ...mutationResult }] = useMutation(
    CREATE_GROUP_MESSAGE_MUTATION,
  );

  const { subscribeToMore, ...queryResult } = useQuery(GROUP_QUERY, {
    variables: { groupId },
  });

  useEffect(() => {
    subscribeToNewMesages();
  }, []);

  function subscribeToNewMesages() {
    subscribeToMore({
      document: GROUP_MESSAGE_ADDED_SUBSCRIPTION,
      variables: {
        groupId,
      },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous;
        const newMessage = subscriptionData.data.messageAdded;

        const result = {
          ...previous,
          group: {
            ...previous.group,
            messages: [newMessage, ...previous.group.messages],
          },
        };
        return result;
      },
    });
  }
  function onSend(messages) {
    const userId = messages[0].user._id;
    const text = messages[0].text;
    createGroupMessage({ variables: { userId, groupId, text } });
  }
  if (queryResult.loading) return <Spinner />;
  if (queryResult.error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  // console.log('queryResult ', queryResult.data);
  // console.log('error ', JSON.stringify(error, null, 2));
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
          <Title>{group.name}</Title>
        </Body>
        <Right />
      </Header>
      <GiftedChat
        onSend={messages => onSend(messages)}
        user={{
          _id: 2,
        }}
        messages={(idx(queryResult.data, _ => _.group.messages) || []).map(
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

export default GroupChatsScreen;
