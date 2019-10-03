import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Root} from 'native-base';

import SideBar from './screens/SideBarScreen';
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator(
  {
    Home: {screen: HomeScreen},
  },
  {
    initialRouteName: 'Home',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    contentComponent: props => <SideBar {...props} />,
  },
);

const AppNavigator = createStackNavigator(
  {
    Drawer: {screen: Drawer},
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <Root>
    <AppContainer />
  </Root>
);
