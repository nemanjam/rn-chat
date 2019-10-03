import React from 'react';
import {Root} from 'native-base';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const AppNavigator = createStackNavigator(
  {
    Login: {screen: LoginScreen},
    Home: {screen: HomeScreen},
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  return (
    <Root>
      <AppContainer />
    </Root>
  );
};

export default App;
