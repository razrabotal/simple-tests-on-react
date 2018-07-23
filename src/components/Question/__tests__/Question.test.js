import React from 'react';
import ReactDOM from 'react-dom';
import Question from '../Question';

import renderer from 'react-test-renderer';

import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const testQuestion = {
  "index": 3,
  "question": {
    "id": "1",
    "img": "              https://cdn-images-1.medium.com/max/2000/1*cvlXS1ag-ndn5YujaJUQ2w.png",
    "q": "Какое главное правило первой помощи?",
    "an": [
      {
        "id": "1",
        "correct": true,
        "comment": "Отличное начало. Это прописано практически во всех современных стандартах.",
        "text": "Безопасность спасателя превыше всего"
      },
      {
        "id": "2",
        "comment": "Нет, так пострадавших будет больше.",
        "text": "Сам погибай, а товарища выручай"
      },
      {
        "id": "3",
        "comment": "Не совсем. Современные стандарты первой помощи таковы, что навредить вы, скорее всего, не сможете.",
        "text": "Не навреди"
      }
    ]
  },
  "iteration": "[function bound currentIteration]",
  "statistics": [
    22,
    12,
    3
  ]
};

test('Question changes the onVote after click', () => {
  const question = shallow(
    <Question key={testQuestion.index} 
      index={1}
      question={testQuestion.question} 
      statistics={testQuestion.statistics} />
  );

  expect(question.state().selected).toEqual(false);
  question.find('.q-button').first().simulate('click');
  expect(question.state().selected).toEqual(true);
});

it('renders correctly', () => {
  const question = renderer.create(
    <Question key={testQuestion.index} index={1} question={testQuestion.question} statistics={testQuestion.statistics} />
  ).toJSON();
  expect(question).toMatchSnapshot();
});
