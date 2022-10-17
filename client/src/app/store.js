import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly.js';

import sessionReducer from './sessionReducer.js';
import notificationReducer from '../features/notifications/notification-reducer.js';
import organizationsReducer from '../features/org-cards/org-cards-reducer.js';
import dashboardWidgetsReducer from '../features/dashboard/dashboard-widgets-reducer.js';
import dashboardInfoReducer from '../features/dashboard/dashboard-info-reducer.js';
import wikiReducer from '../features/wiki/wiki-reducer.js';
import rulesReducer from '../features/gatekeeper/gatekeeper-rules-reducer.js';
import userReducer from '../features/user/user-reducer.js';
import contestStateReducer from '../features/creator-contests/components/contest-live-interface/interface/contest-interface-reducer.js';
import contestRewardsReducer from '../features/creator-contests/components/contest_settings/contest_rewards/reducers/rewards-reducer.js';
import contestParticipantRestrictionsReducer from '../features/creator-contests/components/contest_settings/contest_gatekeeper/reducers/restrictions-reducer.js';

const rootReducer = combineReducers({
  session: sessionReducer,
  notifications: notificationReducer,
  organizations: organizationsReducer,
  dashboardWidgets: dashboardWidgetsReducer,
  dashboardInfo: dashboardInfoReducer,
  wiki_data: wikiReducer,
  gatekeeperRules: rulesReducer,
  user: userReducer,
  contestState: contestStateReducer,
  contestRewards: contestRewardsReducer,
  contestParticipantRestrictions: contestParticipantRestrictionsReducer
});


const store = configureStore({
  reducer: rootReducer,
})

export default store;
