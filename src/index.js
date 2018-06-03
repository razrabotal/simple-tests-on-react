import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import parseInner from './parser';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();



ReactDOM.render(
  <App prueba={parseInner(document.getElementById('root').innerHTML)}/>,
  document.getElementById('root')
);


registerServiceWorker();






