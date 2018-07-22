import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import Title from './App';
import parseInner from './parser';


import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import { shallow, render, mount } from 'enzyme';
global.shallow = shallow;
global.render = render;
global.mount = mount; 

it('should render a title', () => { 
  const wrapper = shallow(
    <App/>
  ); 
  expect(wrapper).toMatchSnapshot();
});

it('renders without crashing', () => {
  var div = document.createElement('div');
  div.id = "root";
  ReactDOM.render(<App prueba={parseInner(`
  ## Приветствие
  # Тест на знание приветствия
   
     Привет
     http://hronika.info/uploads/posts/2016-01/1452884960_holms2.jpg
     - Привет - не
     - Привки - тира уркиау
     + Хай - Да, правильно
     - Хаюшки - ноу
  
   Как дела?
     - Хорошо
     + не хорошо
     - плохо
 
 2 - Все ок
 1 - Ну норм
 0 - Отстой
  `)} />, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders without crashing', () => {
  var div = document.createElement('div');
  div.id = "root";
  ReactDOM.render(<App data={parseInner(`
  ## Приветствие
  # Тест на знание приветствия
   
     Привет
     http://hronika.info/uploads/posts/2016-01/1452884960_holms2.jpg
     - Привет - не
     - Привки - тира уркиау
     + Хай - Да, правильно
     - Хаюшки - ноу
 
   Как дела?
     - Хорошо
     + не хорошо
     - плохо
 
 2 - Все ок
 1 - Ну норм
 0 - Отстой
  `)} />, div);
  ReactDOM.unmountComponentAtNode(div);
});