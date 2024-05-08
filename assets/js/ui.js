'use strict';

let rightOptionIndex;
let isLearnMode;
let historyIndex;
let isHistorySave = true;
let isShuffle = false;
let isAnswerDone = false;
let isNewBases = false;
let tempAnswer = [];
const correctBorder = "var(--right-answer-border)";
const incorrectBorder = "var(--wrong-answer-border)";
const homeButton = document.getElementById('home-button');
const nextButton = document.getElementById('next-button');


class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

class Counter {
  constructor(index) {    
    this.index = index
  }
}

class WrongAnswers {
   constructor(answer) {
     this.answer = answer
   }
}


class Errors {  
  errors = []  
  addError(error) {   
    this.errors.push(error)
  }
}

const wrongAnswers = new Errors();
const currentIndex = new Counter(0);
const currentTest = new CurrentTest();


function putToCache(elem, cache) {
  if (cache.indexOf(elem) !== -1) {
    return;
  }
  let i = Math.floor(Math.random() * (cache.length + 1));
  cache.splice(i, 0, elem);
}


function madness() {
  let cache = [];
  return function(a, b) {
    putToCache(a, cache);
    putToCache(b, cache);
    return cache.indexOf(b) - cache.indexOf(a);
  };
}


function shuffle(arr) {  

    let compare = madness();
    return arr.sort(compare);

}

function showErrors(id) {

  let indexes =  wrongAnswers.errors[id]; 

  document.getElementById('test').style.display = 'block';

  const questIndex = indexes[0];

  const answerIndex = indexes[1]; 
  
  document.getElementById('question').innerHTML = tempAnswer[questIndex][0];
  
  for (var i = 0; i < 4; ++i) {
    
    document.getElementById('option' + i).style.border = 'none';
    
    if (tempAnswer[questIndex][1][i][1] == 1) {
      
      document.getElementById('option' + i).style.border = correctBorder;     
    } 

     document.getElementById('option' + i).disabled = true;
    
     document.getElementById('option' + i).innerHTML = tempAnswer[questIndex][1][i][0];
   
  }

  document.getElementById('option' + answerIndex).style.border = incorrectBorder;
  
}



function updateQuestionBlock() {  

  let currentQuestionBlock = currentTest.test[currentIndex.index];  

  let optionsCount = currentQuestionBlock[1].length;
  
  if(optionsCount < 4) {

    while(optionsCount < 4) {

      currentQuestionBlock[1].push(["Нет варианта ответа (*)", 0]);

      optionsCount++;

    }

  }  

  shuffle(currentQuestionBlock[1]);  

 
  for (var i = 0; i < 4; ++i) {
    if (currentQuestionBlock[1][i][1] == 1) {
      rightOptionIndex = i;
    }
    document.getElementById('option' + i).innerHTML = currentQuestionBlock[1][i][0];
    document.getElementById('option' + i).style.border = 'none';
    document.getElementById('option' + i).disabled = false;
  }
  document.getElementById('question').innerHTML = currentQuestionBlock[0];

  document.getElementById('counter').innerHTML = `Вопрос: ${currentIndex.index + 1}/${currentTest.test.length}`;

}


function setTrainingMode(optionIndex) { 

  // document.getElementById('button-next').style.display = "inline-block";

  nextButton.style.display = "inline-block";

  let borderColor = '';

  if (currentTest.test[currentIndex.index][1][optionIndex][1] == 1) {

    borderColor = correctBorder;

  } else {

    borderColor = incorrectBorder;

    document.getElementById('option' + rightOptionIndex).style.border = correctBorder;
  }

    document.getElementById('option' + optionIndex).style.border = borderColor;  

  for (let element of document.getElementById('test').children) {
    element.disabled = true;
  }

}



function calcRightAnswers(questionsQuantity, errorsQuantity ) {

  let rightAnswersQuantity = Math.round(questionsQuantity - errorsQuantity);

  let percent = Math.round(rightAnswersQuantity * 100 / (questionsQuantity));

  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}



function showTestResult(isTestFinished) {

  if(currentIndex.index === 0 || isAnswerDone === false) {
    showLevels();
    return;
  }

  // let testState = '';
  // let state = ''; 

  let testState, questionQuantity, state = '';
 // let state = ''; 

  if (localStorage.getItem(currentTest.id)) {

    getErrorsArray();

    //alert(wrongAnswers)
  }


  //let questionQuantity = '';



  if (isTestFinished === false) {

   // testState = `<br>Тест остановлен.<br>Пройдено вопросов: ${currentQuestionIndex} из ${currentTest.length}<br>`;
     state = 'остановлен';
     questionQuantity = currentIndex.index;

  }

  else {

    state = 'завершен';
    questionQuantity = currentIndex.index + 1;
  }

  testState = `<br>Тест ${state}.<br>Пройдено вопросов: ${questionQuantity} из ${currentTest.test.length}<br>`;


  const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, wrongAnswers.errors.length);


  let success = '';

  if(state === 'завершен') {
      success = '<br>Тест успешно пройден!<br>';    
  }

  const unsuccess = '<br>Ваши ошибки:<br>';

  let result = `${testState}Правильных ответов:  ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)`;

  result += (errorsPercent < 100) ? unsuccess : success;

  document.getElementById('result').innerHTML = result;

  ///////////////////////////////////////////////////////////

  // for (var index = 0; index < wrongAnswers.errors.length; ++index) {
  //   const btn = document.getElementById('errors');
  //   btn.innerHTML += `<button id="${index}" class="error-button">${index + 1}</button>`;


  // }

  createButtons(wrongAnswers.errors, "error-button", "errors");

  /////////////////////////////////////////////////

}

function createButtons(buttonsArray, className, parantId) {

  const parant = document.getElementById(parantId);

  for(let i = 0; i < buttonsArray.length; i++){
    let btn = document.createElement('button')
    btn.innerText = i + 1;
    btn.className = className;
    btn.id = i;   
    parant.appendChild(btn)    
  }

}

function removeButtons(parantId) {
  
  const parant = document.getElementById(parantId);  
  
  parant.replaceChildren();
  
}

// function removeQuestionButtons() {
  
//   const buttons = document.getElementById('qust-btn-container');  
  
//   buttons.replaceChildren();
  
// }

//const errorsContainer = document.querySelector('#errors');


document.addEventListener("click", (event) => {

  const buttonClass = event.target.className;

  const buttonId = event.target.id;  

  if (buttonClass == "error-button") {

    chageButtonColor(buttonId);  

    showErrors(buttonId);

  }  

  if (buttonClass == "font-size-change") {

    chageFontSize(buttonId);
  }


});

function chageButtonColor(buttonId) {  

    for (let button of document.getElementById('errors').children) {
      
      button.style.backgroundColor = "var(--main-bg-color)";

      if(button.id == buttonId) {

        button.style.backgroundColor = "var(--error-btn-color)";
    
      }

    }

    //showErrors(buttonId);
}



//////////////////////////////////////////////////

    //document.getElementById(buttonId).style.background = "var(--error-btn-color)";

    //const button = document.getElementById(buttonId);

    //alert(buttonId)

    //button.classList.add('.selected');
   //button.style.background = "var(--error-btn-color)";



    // showErrors(buttonId);

    // links.forEach(link => {
    //   link.setAttribute("style", "background:`:root { --main-bg-color}`");

    // });
    // document.getElementById(buttonId).style.background = "var(--error-btn-color)";

    // errorButtons.forEach(button => {
      

    //    button.classList.add('selected');
        
  
    //   });

  



  // if (buttonClass == "font-size-change") {

  //    chageFontSize(buttonId);
  // }


// });

// document.addEventListener("click", function(event) {

//   const buttonClass = event.target.className;

//   if (buttonClass == "font-size-change") {

//     chageFontSize(buttonId);
//  }

// });


//переход на главную страницу, нажата кнопка На главную
homeButton.addEventListener("click", function(event) {

  const buttonText = event.target.textContent

  if (buttonText == "Завершить") {

    showResultsPage();
    showTestResult(false);
    historyMenu.style.display = "none";

  }
  if (buttonText == "На главную") { 

    isAnswerDone = false;

   // removeButtons("errors");

    showLevels();

  }


  if(isShuffle) {

    localStorage.removeItem(currentTest.id);
    currentTest.id = '';


  }

  currentIndex.index = 0;


})

nextButton.addEventListener("click", function() {

  updateQuestionBlock();
  //document.getElementById('nextbutton').style.display = "none";

  nextButton.style.display = "none";

})
/////////////////////////////////////////////////////
function getCurrentTime() {

  let date = new Date();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');  

  // alert(`${hour}:${minute}-${day}.${month}.${year}`);

  return `${hour}:${minute}-${day}.${month}.${year}`

}
///////////////////////////////////////////////////////////////


function saveTestHistory(optionIndex) {   

  
/////////////////////////////////////////
  //const  wrongIndex = getWrongOptionIndex(index);
  ////////////////////////////////////////////////

  //alert(optionIndex)

  let testSavedName = currentTest.id;

  const savedItem = localStorage.getItem(testSavedName);

  let wrongOption = ''

  if (optionIndex != rightOptionIndex) {

   // alert(optionIndex)

    const  wrongIndex = getWrongOptionIndex(optionIndex);  

    wrongOption = `[${currentIndex.index},${wrongIndex}]`;

  }

  


  if(savedItem == null){

    localStorage.setItem(testSavedName, `${currentIndex.index}$${wrongOption}`);

  } else {


      let history = savedItem.split("$");

      let historyData = history[1];



    if (history[0] <= currentTest.test.length) {

      let newData = '';

      if (historyData.length != 0 && wrongOption.length != 0) {

        historyData += "; ";

      }
      
     // alert(newData)
      
      if (wrongOption.length == 0) {        


        newData = `${currentIndex.index}$${historyData}`;

      } else {

        newData = `${currentIndex.index}$${historyData}${wrongOption}`;
        //alert(newData)
        

      }

        
      localStorage.setItem(testSavedName, newData);

    }

  }


}

//получаем соответствующий индекс в несортированном массиве для правильного сохранения истории
function getWrongOptionIndex(chosenIndex) {

 // alert(chosenIndex)

  let saveIndex;

  const currentOption = currentTest.test[currentIndex.index][1][chosenIndex].toString();
  
  const unshuffledOptions = tempAnswer[currentIndex.index]; 

  unshuffledOptions[1].forEach((item, index) => {

    if (item == currentOption) {
      //alert(index + " --- "  + "here")
       saveIndex = index;         
    }   
    
  });

 // alert(saveIndex)

  return saveIndex;
 
}


function checkAnswer(chosenOptionIndex) {  

  isAnswerDone = true; 


 // alert(chosenOptionIndex);
  //finilizeTest
  if (currentIndex.index === currentTest.test.length - 1) {  
    
    saveTestHistory(chosenOptionIndex); 
    showResultsPage();
    showTestResult(true);

    currentIndex.index = 0;

    return;

  }
 
  if(isHistorySave){   
    saveTestHistory(chosenOptionIndex);
  }


  //  LearnMode //////////////////////////
  //при верном ответе автоматически преходит на следующий вопрос, в новой редакции переход осуществляется пользователем
  //if (isLearnMode === true && index != rightOptionIndex) { 
  ///////////////////////////////////////////////////////////////////////////
 // if (isLearnMode === true) { 
  if (isLearnMode === true && chosenOptionIndex != rightOptionIndex) { 
    setTrainingMode(chosenOptionIndex);
    currentIndex.index++;
    return;
  } 

  currentIndex.index++;
  updateQuestionBlock();
}






function showMainPage() {

  document.getElementById('main-page').style.display = "block";
  document.getElementById('results').style.display = "none";
  document.getElementById('levels').style.display = "none";
  document.getElementById('questions-counter').style.display = 'none';
  document.getElementById('test').style.display = "none";
  document.getElementById('nav-block').style.display = "none";
  document.getElementById('result').style.display = "none";

}



function showLevels() {

  document.getElementById('home-button').style.display = "none";
  document.getElementById('nav-block').style.display = "none";
  document.getElementById('levels').style.display = "block";
  document.getElementById('errors').innerHTML = "";
  document.getElementById('test-title').innerHTML = "";
  document.getElementById('results').style.display = "none";
  document.getElementById('test').style.display = "none";
  document.getElementById('menu-button').style.display = "block";
  document.getElementById('header').style.display = "flex";
  document.getElementById('remove-history-block').style.display = "none";

      wrongAnswers.errors.length = 0;

}

function showTest() {
  document.getElementById('questions-counter').style.display = 'block';
  document.getElementById('levels').style.display = "none";
  document.getElementById('counter').style.display = "block";
}



function getCurrentIndex(testId) {      

  let currentIndex = 0; 

  if(testId in localStorage) {

    const history = getTestHistory(testId);   

    if (extractIndex(history) === currentTest.test.length) {

      removeTestHistory(testId);

    }
    if(extractIndex(history) < currentTest.test.length ) {

       currentIndex = extractIndex(history)
    }


  }

  return currentIndex;

}


function extractIndex(history) {

  return Number(history.slice(0, history.indexOf("$"))) + 1;

}




function getErrorsArray() {

  let errors = localStorage.getItem(currentTest.id).split("$");

  if (errors[1].length == 0) return;

  let errorsArray = errors[1].split(';');

  errorsArray.forEach(error => {

    var array = JSON.parse(error);

        wrongAnswers.addError(array)

  });


}

// function chooseTest() {

//   currentTest.id = event.target.id;   


  
//   let currentTestList = getTestList();
  
//   currentTest.test = currentTestList[currentTest.id][0]

//   //tempAnswer = currentTestList[currentTest.id][0].slice();

//   tempAnswer = JSON.parse(JSON.stringify(currentTestList[currentTest.id][0]))

//   //alert(tempAnswer.length)

//   if (isShuffle) {   

//     //alert('shuffle')

//     shuffle(currentTest.test);  

//     currentTest.id += '$';

//   } 

//   if(isLearnMode) { 

//     currentTest.id += '*';

//   }

//   currentIndex.index = getCurrentIndex(currentTest.id);

//   showChosenTest(event.target.textContent, currentTest.test.length); 

//   //alert(currentTest.test[0])

//   updateQuestionBlock();

// }



//choose test
document.addEventListener("click", function(event) {  
  
 

  if(event.target.name == "set-profile") {

     alert(event.target.textContent);
  }

  if(event.target.name !== "test") return;

  // if(event.target.id == "set-profile-button") {

    //alert(event.target.id)
  //}

   

 // alert(event.target.id)
 
  currentTest.id = event.target.id;   


  
  let currentTestList = getTestList();
  
  currentTest.test = currentTestList[currentTest.id][0]

  //tempAnswer = currentTestList[currentTest.id][0].slice();

  tempAnswer = JSON.parse(JSON.stringify(currentTestList[currentTest.id][0]))

  //alert(tempAnswer.length)

  if (isShuffle) {   

    //alert('shuffle')

    shuffle(currentTest.test);  

    currentTest.id += '$';

  } 

  if(isLearnMode) { 

    currentTest.id += '*';

  }

  currentIndex.index = getCurrentIndex(currentTest.id);

  showChosenTest(event.target.textContent, currentTest.test.length); 

  //alert(currentTest.test[0])

  updateQuestionBlock();

  //alert(currentTest.test[0])

})


function removeTestHistory(testId) {      

  localStorage.removeItem(testId);

}

function getTestHistory(testId) {

  return localStorage.getItem(testId)

}

function setTestHistory(testId) {

  localStorage.setItem(testId)

}




//====================================================================================


showquestion.addEventListener("click", function(){
  
  const questNumber = document.getElementById('input-number').value;

  if(questNumber === '') {
    alert('Введите номер вопроса!');
    return;
  }  

  //removeQuestionButtons('qust-btn-container');  
  clearQuestionBlock('qust-btn-container');

  //alert(document.getElementById('search-test-block').className)
  
  createQuestionButtons(questNumber);
  
});


function createQuestionButtons(questionNumber) {

  const testsNames = document.getElementById('dropdownlist');

  const chosenTestName = testsNames.options[testsNames.selectedIndex].text; 

  const test = getChosenTest(chosenTestName) 

  const questionBlock = test[questionNumber];
  
  const line = document.createElement('hr');

  line.className = "line";

  const buttons = document.getElementById('qust-btn-container');

  let btnContent; 

  for(let i = 0; i < 5; i++) {  

    if(i == 0) {

      btnContent = questionBlock[0];
      
    }  else {

      btnContent = questionBlock[1][i -1];
      
    }
    
    
    if(i == 1) {

      buttons.appendChild(line);
      
    }    

    const testButton = document.createElement('button');   

    testButton.id = i;

    testButton.className = "option-button";

    testButton.textContent = btnContent;

    buttons.appendChild(testButton);
    

  }

 
  
}

function clearQuestionBlock(container) {
  
  const buttonsContainer = document.getElementById(container); 
  
  if (buttonsContainer.hasChildNodes()) { 
    
    buttonsContainer.replaceChildren();

  }  
 
}

function fillTestsList(testsList) {

  const list = Object.values(testsList);

  let dropDownList = document.getElementById("dropdownlist");

  dropDownList.options.length = 0;



  for (let i = 0; i < list.length; i++) {
    let testName = list[i][1];
    let el = document.createElement("option");
    el.textContent = testName;
    el.value = testName;           
    dropDownList.appendChild(el);
  }  
  
  showTestLength(dropDownList[0].value); 
  
}

dropdownlist.addEventListener('change', (event) => {
    
  showTestLength(event.target.value); 
  document.getElementById('input-number').value = '';
  clearQuestionBlock('qust-btn-container');

});




function showTestLength(testName) {  
  
  const test = getChosenTest(testName);
  
  document.getElementById('test-length').innerText = `Вопросов в тесте: ${test.length}`;

 
}


function getChosenTest(testName) {

  let test = [];

  const testList = getTestList();

  const keys = Object.keys(testList);   

  keys.forEach((key, index) => {

    if(testList[key][1] == testName) {        

     test = testList[key][0];
    }

  });

  return test;
}


document.querySelectorAll('input[type="radio"][name="div"]').forEach(radio => {
  radio.addEventListener('change', () => console.log(radio.value));
});




//===================================================================================

function showResultsPage() {
  document.getElementById('home-button').style.display = "block";
  document.getElementById('next-button').style.display = "none";
  document.getElementById('results').style.display = 'block';
  document.getElementById('test').style.display = "none";
  document.getElementById('result').style.display = "block";
  document.getElementById('counter').style.display = "none";
  document.getElementById('home-button').innerText = "На главную";
  document.getElementById('remove-history-block').style.display = "none";
}

function showChosenTest(testName, testLength) {

  document.getElementById('test').style.display = "block";
  document.getElementById('counter').innerHTML = "Вопрос: 1/" + testLength;
  document.getElementById('counter').style.display = "block";
  document.getElementById('questions-counter').style.display = 'block';
  document.getElementById('levels').style.display = "none";
  document.getElementById('nav-block').style.display = "block";
  document.getElementById('next-button').style.display = "none";
  document.getElementById('home-button').innerText = "Завершить";
  document.getElementById('home-button').style.display = "block";
  document.getElementById('menu-button').style.display = "none";
  document.getElementById('test-title').innerHTML = testName;
  document.getElementById('header').style.display = "none";
  document.getElementById('remove-history-block').style.display = "block";
  
  

}