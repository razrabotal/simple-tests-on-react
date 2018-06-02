import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();



ReactDOM.render(<App prueba={parseInner(document.getElementById('root').innerHTML)} dataf={
    {
      title: "Тест о конях",
      descr: "Тест даст понять насколько хорошо вы разбираетесь в конях.",
      questions: [
        {
          id: 1,
          img: "https://freewoman.club/files/image/orig/kak-dela-min_409.jpg",
          imgDescr: "Фото там какое-то",
          q: "Как вас зовут?",
          an: [
            {
              id: 1,
              text: "Света",
              comment: "Правильно",
              correct: true
            },
            {
              id: 2,
              text: "Свитка",
              comment: "Не, нифига"
            },
            {
              id: 3,
              text: "Світка",
              comment: "Не, нифига",
            }
          ]
        },
        {
          id: 2,
          q: "Как дела?",
          an: [
            {
              id: 1,
              text: "Норм",
              comment: "Неее, дела уже хорошо",
            },
            {
              id: 2,
              text: "Хорошо",
              comment: "Дааааааа. Все ок.",
              correct: true
            }
          ]
        },
        {
          id: 3,
          img: "http://w-n.com.ua/wp-content/uploads/2016/10/прогноз-погоды-на-зиму-в-Украине-2016-2017-650x276.jpg",
          q: "Что принесла зима",
          an: [
            {
              id: 1,
              text: "Холод",
              comment: "Нет, холод она не принесла"
            },
            {
              id: 2,
              text: "Вьюгу",
              comment: "Ну да, вьюга была",
              correct: true
            },
            {
              id: 3,
              text: "Метель",
              comment: "Метели не было",
            }
          ]
        },
        {
          id: 4,
          q: "Параметры съемки фотоаппарата изменяются физическими ручками и кнопками, а не виртуальными элементами на экране. С какой точки зрения это хорошо?",
          an: [
            {
              id: 1,
              text: "Ни с какой, такой подход устарел и не соответствует идее человечности",
              comment: "Ноуп"
            },
            {
              id: 2,
              text: "Благодаря постоянному расположению вырабатывается привычка, пользователь изменяет настройки не глядя",
              comment: "Да да",
              correct: true
            },
            {
              id: 3,
              text: "Интерфейс лишён модальности",
              comment: "Что такое модальность?",
            },
            {
              id: 4,
              text: "Новичку сразу вск понятно",
              comment: "Не понятно",
            }
          ]
        }
      ],    
      results: [
        {
          points: 4,
          text: "Вы шарите в конях"
        },
        {
          points: 2,
          text: "Вы плохо понимаете в конях"
        },
        {
          points: 0,
          text: "Вы недостаточно понимаете в конях"
        }
      ]
    }
    
  }/>,
  document.getElementById('root')
);


registerServiceWorker();






function parseInner(text) {
var innerArray = replaceSpaces(text).split("\n\n");

function replaceSpaces(data){
  data = data.replace(/\n *\n/gi,"\n\n").trim()
  return data;
}

// Title and Description
var titleAndDescr = '';

if( titleCheckCorrect(innerArray[0]) ) {
  var titleArray = parseTitleArray(innerArray[0]);
  var titleAndDescr = `
    "title": "${titleArray[0].trim()}", 
    "descr": "${titleArray[1].trim()}",
  `;
  innerArray.shift();
}  

function titleCheckCorrect(data) {
  return data.trim().match(/^\##/);
}

function parseTitleArray(data) {
  data = data.replace(/## |# /gi,"").split("\n");
  return data;
}


// Test results
var results = '';
var resultsForJSON = [];
var resultsArray = parseResultArray(innerArray[innerArray.length-1]);

if(resultCheckCorrect(resultsArray[0])) {
  
  for(var item of resultsArray) {
    var itemArray = item.split("-");
    resultsForJSON.push(`
      {
        "points": ${itemArray[0].trim()},
        "text": "${itemArray[1].trim()}"
      }
    `);
  }
  
  results = ', "results": [ '+ resultsForJSON.toString() +' ]';
  innerArray.pop();
}

function resultCheckCorrect(data) {
  return data.trim().match(/\d - /i);
}

function parseResultArray(data) {
  data = data.split("\n");
  return data;
}


var questions = "";
var questionsArray = [];

function parseQuestionsArray(data) {
  data = data.split("\n");
  return data;
}

function parseAnswer(data) {
  data = data.trim().replace(/(^- )|(^\+ )/gi,"");
  return data;
}

function imageCheckCorrect(data) {
  return data.trim().indexOf("http") === 0;
}

for(var j = 0; j < innerArray.length; j++) {
  
  var itemArray = parseQuestionsArray(innerArray[j]);
  
  // Set id
  var id = `"id":"${j+1}", `;

  // Set Title
  var title = `"q": "${itemArray[0]}", `;
  itemArray.shift();

  // Set Image
  var img = '';  
  if( imageCheckCorrect(itemArray[0]) ) {
    img = `"img": "${itemArray[0]}", `;
    itemArray.shift();
  }

  // Set Answers
  var answersArray = [];
  
  for(var i = 0; i < itemArray.length; i++) {
    var answerString = "";
    var answer = itemArray[i];
  
    // Set Answer ID
    answerString += `"id":"${i+1}", `;
  
    // Set Answer Correct
    if(answer.trim().indexOf("+ ") === 0) {
      answerString += `"correct":true, `;
    } 
  
    answer = parseAnswer(answer);
    var answerArray = answer.split(" - ");
    // Check and set Answer Comment
    if(answerArray[1]) {
      answerString += `"comment":"${answerArray[1]}", `;
    }
    
    // Set Answer Text
    answerString += `"text":"${answerArray[0]}"`;
  
    answersArray.push(`{ ${answerString} }`);
  }

  // Set Answers
  var answers = '"an": [ '+ answersArray.toString() +' ]';

  questionsArray.push(`{ ${id} ${img} ${title} ${answers} }`);
}

var questions = '"questions": [ '+ questionsArray.toString() +' ]';

// Final step
return JSON.parse(`{${titleAndDescr} ${questions} ${results}}`);
}