import 'babel-polyfill';

import TeaStore from './store/TeaStore'
import TeaHomeRoute from './routes/TeaHomeRoute'

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={TeaStore}
    queryConfig={new TeaHomeRoute()}
  />,
  document.getElementById('root')
);
