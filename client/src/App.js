import React from 'react';
import { Root } from 'native-base';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatsScreen from './screens/ChatsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';

import authReducer from './store/reducers/authReducer';

// ============== navigation ================

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
    Chats: { screen: ChatsScreen },
    UserProfile: { screen: UserProfileScreen },
    GroupDetails: { screen: GroupDetailsScreen },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

// ============ redux ===============
const config = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = persistCombineReducers(config, {
  authReducer,
});

const store = createStore(
  rootReducer,
  {}, // initial state
  composeWithDevTools(applyMiddleware(thunk)),
);

const persistor = persistStore(store);

// =========== apollo ==============

const uri = '10.0.2.2:5000';
// const uri = '192.168.0.185:5000';
const httpLink = createHttpLink({ uri: `http://${uri}` });

// client
export const wsClient = new SubscriptionClient(`ws://${uri}/graphql`, {
  lazy: true,
  reconnect: true,
  connectionParams() {
    return { jwt: store.getState().authReducer.user.jwt };
  },
});

const wsLink = new WebSocketLink(wsClient);

// middleware for requests
const middlewareLink = setContext((req, previousContext) => {
  const { jwt } = store.getState().authReducer.user;
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
  }
  return previousContext;
});

// afterware for responses
const errorLink = onError(({ graphQLErrors, networkError }) => {
  let shouldLogout = false;
  if (graphQLErrors) {
    console.log({ graphQLErrors });
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log({ message, locations, path });
      if (message === 'Unauthorized') {
        shouldLogout = true;
      }
    });

    if (shouldLogout) {
      store.dispatch(logout());
    }
  }
  if (networkError) {
    console.log('[Network error]:');
    console.log({ networkError });
    if (networkError.statusCode === 401) {
      store.dispatch(logout());
    }
  }
});

const requestLink = ({ httpLink, wsLink }) => {
  return split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
};

const link = ApolloLink.from([
  errorLink,
  requestLink({
    httpLink: middlewareLink.concat(httpLink),
    wsLink: wsLink,
  }),
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = props => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Root>
            <AppContainer />
          </Root>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
