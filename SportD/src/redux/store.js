// import {createStore, compose, applyMiddleware} from 'redux';
// import rootReducer from './reducers';
// import rootSaga from './saga';
// import createSagaMiddleware from 'redux-saga';

// const sagaMiddleware = createSagaMiddleware();

// const configureStore = compose(applyMiddleware(sagaMiddleware))(createStore)(
//   rootReducer,
// );

// export const store = createStore(rootReducer);

// sagaMiddleware.run(rootSaga);

import {createStore} from 'redux';
import RootReducer from './reducers';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'root',
  // version: 1,
  storage: AsyncStorage,
  // whitelist: ['auth', 'users'],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);
const store = createStore(persistedReducer);

export const persistor = persistStore(store);

export default store;
