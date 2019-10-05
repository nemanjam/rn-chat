import React from 'react';
import {Root} from 'native-base';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatsScreen from './screens/ChatsScreen';
import ContactProfileScreen from './screens/ContactProfileScreen';

const AppNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Chats: {screen: ChatsScreen},
    ContactProfile: {screen: ContactProfileScreen},
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const uri = 'http://10.0.2.2:5000';
const httpLink = createHttpLink({uri});

export const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});

const App = props => {
  return (
    <ApolloProvider client={client}>
      <Root>
        <AppContainer />
      </Root>
    </ApolloProvider>
  );
};

export default App;
