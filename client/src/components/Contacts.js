import React from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import { StyleSheet } from 'react-native';

import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
} from 'native-base';

import { CONTACTS_QUERY } from '../graphql/queries';

const Contacts = props => {
  const { data, loading, error } = useQuery(CONTACTS_QUERY, {
    variables: { id: 1 },
  });
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{JSON.stringify(error, null, 2)}</Text>;
  const { contacts } = data;
  return (
    <List>
      {contacts.map((contact, index) => {
        return (
          <ListItem
            style={styles.listItem}
            key={index}
            thumbnail
            button
            onPress={() => props.navigation.navigate('ContactProfile')}>
            <Left>
              <Thumbnail source={{ uri: contact.avatar }} />
            </Left>
            <Body>
              <Text>{contact.username}</Text>
              <Text note numberOfLines={1}>
                {contact.description}
              </Text>
            </Body>
          </ListItem>
        );
      })}
    </List>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
  },
});
export default Contacts;
