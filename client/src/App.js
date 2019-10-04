import React from 'react';
import {Root} from 'native-base';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatsScreen from './screens/ChatsScreen';

const AppNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Chats: {screen: ChatsScreen},
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const App = props => {
  return (
    <Root>
      <AppContainer />
    </Root>
  );
};

export default App;
