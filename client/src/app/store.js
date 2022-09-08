import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers, applyMiddleware } from "redux";
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import axios from 'axios'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';


import notificationReducer from '../features/notifications/notification-reducer';
import organizationsReducer from '../features/org-cards/org-cards-reducer';
import connectedReducer from '../features/wallet/wallet-reducer';
import dashboardWidgetsReducer from '../features/dashboard/dashboard-widgets-reducer';
import dashboardInfoReducer from '../features/dashboard/dashboard-info-reducer';
import wikiReducer from '../features/wiki/wiki-reducer';
import rulesReducer from '../features/gatekeeper/gatekeeper-rules-reducer';
import userReducer from '../features/user/user-reducer';
import contestStateReducer from '../features/creator-contests/components/contest-live-interface/interface/contest-interface-reducer';
import rewardOptionsReducer from '../features/creator-contests/components/contest_settings/contest_rewards/reducers/reward-options-reducer';
import submitterRewardsReducer from '../features/creator-contests/components/contest_settings/contest_rewards/reducers/submitter-rewards-reducer';
import voterRewardsReducer from '../features/creator-contests/components/contest_settings/contest_rewards/reducers/voter-rewards-reducer';


const rootReducer = combineReducers({
  notifications: notificationReducer,
  organizations: organizationsReducer,
  connectivity: connectedReducer,
  dashboardWidgets: dashboardWidgetsReducer,
  dashboardInfo: dashboardInfoReducer,
  wiki_data: wikiReducer,
  gatekeeperRules: rulesReducer,
  user: userReducer,
  contestState: contestStateReducer,
  rewardOptions: rewardOptionsReducer,
  submitterRewards: submitterRewardsReducer,
  voterRewards: voterRewardsReducer
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


const store = configureStore({
  reducer: rootReducer,
})

export default store;
