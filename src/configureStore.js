import { createStore } from 'redux';
import taskState from './reducers/reducer';

export default function configureStore(initialState) {
  const store = createStore(taskState, initialState);

  if(module.hot) {
    module.hot.accept('./reducers/reducer', () => {
      const nextRootReducer = require('./reducers/reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}