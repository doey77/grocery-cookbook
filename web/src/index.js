import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import NavigationMaster from './NavigationMaster';

ReactDOM.render(
  <NavigationMaster></NavigationMaster>,
  document.getElementById('root')
);