import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import parseInner from './parser';

ReactDOM.render(
  <App prueba={parseInner(document.getElementById('q-simple').innerHTML)}/>,
  document.getElementById('q-simple')
);

registerServiceWorker();






