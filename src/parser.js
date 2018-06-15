function parseInner(text) {
  var innerArray = replaceSpaces(text).split("\n\n");
  
  function replaceSpaces(data){
    data = data.replace(/\n *\n/gi,"\n\n").trim()
    return data;
  }

  // Key test
  var keyTest = '';
  if( keyCheckCorrect(innerArray[0])) {
    var parsedKey = parseKey(innerArray[0]);
    keyTest = `
      "qkey": "${parsedKey}", 
    `;
    innerArray.shift();
  }  
  function keyCheckCorrect(data) {
    return data.trim().match(/^\$\w{10}/);
  }
  function parseKey(data) {
    data = data.replace(/\$/gi,"").trim();
    return data;
  } 
  
  // Title and Description
  var titleAndDescr = '';
  
  if( titleCheckCorrect(innerArray[0])) {
    var titleArray = parseTitleArray(innerArray[0]);
    titleAndDescr = `
      "title": "${titleArray[0].trim()}", 
      "descr": "${titleArray[1].trim()}",
    `;
    innerArray.shift();
  }  
  
  function titleCheckCorrect(data) {
    return data.trim().match(/^# | ##/);
  }
  
  function parseTitleArray(data) {
    data = data.replace(/# |## /gi,"").split("\n");
    return data;
  }  
  
  // Test results
  var results = '';
  var resultsForJSON = [];
  var resultsArray = parseResultArray(innerArray[innerArray.length-1]);
  
  if(resultCheckCorrect(resultsArray[0])) {
    
    for(var item of resultsArray) {
      var iArray = item.split("-");
      resultsForJSON.push(`
        {
          "points": ${iArray[0].trim()},
          "text": "${iArray[1].trim()}"
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
    var title = `"q": "${itemArray[0].trim()}", `;
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
  
  questions = '"questions": [ '+ questionsArray.toString() +' ]';
  
  // Final step
  return JSON.parse(`{${keyTest} ${titleAndDescr} ${questions} ${results}}`);
  }


  export default parseInner;