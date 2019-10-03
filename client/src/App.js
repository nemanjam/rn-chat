import React from 'react';
import {StyleSheet} from 'react-native';

import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <>
      <HomeScreen />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
});

export default App;
