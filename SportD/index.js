/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {AppRegistry, Text} from 'react-native';
import store from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './src/redux/store';
import Loading from './src/screens/components/Loading';
import App from './App';
import {name as appName} from './app.json';
// const store = createStore(RootReducer);

const reduxApp = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <App />
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => reduxApp);
