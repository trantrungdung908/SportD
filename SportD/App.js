import 'react-native-get-random-values';
import React from 'react';
import RootStack from './src/navigation/RootStack';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs();
const App = () => {
  return <RootStack />;
};

export default App;
