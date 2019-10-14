import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { StyleSheet, Image } from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Card,
  CardItem,
  Spinner,
} from 'native-base';

import { GROUP_QUERY } from '../graphql/queries';

const GroupDetailsScreen = props => {
  const groupId = props.navigation.getParam('groupId');
  const { data, error, loading } = useQuery(GROUP_QUERY, {
    variables: { groupId },
  });

  if (loading) return <Spinner />;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;

  const { chat: group } = data;
  //   console.log(data);
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
      <Content>
        <Card style={styles.card}>
          <CardItem>
            <Body>
              <Image source={{ uri: group.avatar }} style={styles.image} />
            </Body>
          </CardItem>
          <CardItem>
            <Text>Owner:</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{group.description}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Left>
              <Button small bordered>
                <Text>Join</Text>
              </Button>
            </Left>
            <Body>
              <Button small bordered>
                <Text>Edit</Text>
              </Button>
            </Body>
            <Right>
              <Button small bordered>
                <Text>Del</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  usernameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    height: 100,
    width: null,
    flex: 1,
    alignSelf: 'stretch',
  },
});
export default GroupDetailsScreen;
