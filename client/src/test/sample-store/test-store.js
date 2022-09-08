import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';


import contestStateReducer from '../../features/creator-contests/components/contest-live-interface/interface/contest-interface-reducer';


const rootReducer = combineReducers({
    contestState: contestStateReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    //  whitelist: ['notifications']
    whitelist: []
};
/*
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk.withExtraArgument(axios)],
    enhancers: devToolsEnhancer,
});
*/


const setupStore = preloadedState => configureStore({
    reducer: rootReducer,
    preloadedState
})

export default setupStore;
