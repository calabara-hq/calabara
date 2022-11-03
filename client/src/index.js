import React, { useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css'
import App from './app/app'
import store from './app/store';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
