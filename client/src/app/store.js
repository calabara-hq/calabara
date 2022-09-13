import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
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
import contestRewardsReducer from '../features/creator-contests/components/contest_settings/contest_rewards/reducers/rewards-reducer';


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
  contestRewards: contestRewardsReducer
});


const store = configureStore({
  reducer: rootReducer,
})

export default store;
