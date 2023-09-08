
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer,autoRehydrate } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'

// Reducers imported
import { groupReducer } from "./groups/reducers";
import { contactReducer } from "./contacts/reducers";
import { gradeReducer } from "./grades/reducers";
import { classReducer } from "./classes/reducers";
import { roleReducer } from "./roles/reducers";
import { messageReducer } from "./messages/reducers";

const rootReducer = combineReducers({
  groups: groupReducer,
  contacts: contactReducer,
  grades: gradeReducer,
  classes: classReducer,
  roles: roleReducer,
  messages: messageReducer
});
// // Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method
  storage,
  // Merge two-levels deep.
  stateReconciler: autoMergeLevel2,
  // Whitelist (Save Specific Reducers)
  whitelist: ["grades", "classes", "roles", "messages"],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    
  ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const middlewares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);
  let store = createStore(persistedReducer,composeWithDevTools(middleWareEnhancer))
  let persistor = persistStore(store)
  return { store, persistor }
}