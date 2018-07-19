import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import parseInner from './parser';

var html = document.getElementById('q-simple').innerHTML;
document.getElementById('q-simple').innerHTML = "";

ReactDOM.render(
  <App data={parseInner(html)}/>,
  document.getElementById('q-simple')
);



registerServiceWorker();






