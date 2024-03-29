
const mainMenu = document.getElementById("main-dropdown-menu");
const mainPage = document.getElementById("levels");
const header = document.getElementById("header");
const historyMenu = document.getElementById("history-dropdown-menu");
const profilePage = document.getElementById("profile-page"); 
const searchPage = document.getElementById("search-page"); 

'use strict';

function chageFontSize(buttonId){  

  const bodyStyles = window.getComputedStyle(document.body);

  const oldSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

  let newSize = 20;   

  if(buttonId == "font-increase"){  

    newSize = (parseFloat(oldSize) + 1).toFixed(2);       
  }

  if(buttonId == "font-decrease"){

    newSize = (parseFloat(oldSize) - 1).toFixed(2);
  }   

  if(newSize <= 23 && newSize >= 17){

    document.body.style.setProperty("--btn-font-size", `${newSize}px`);//set

    document.getElementById('fontsize').style.fontSize = `${newSize}px`;

    localStorage.setItem('size', newSize);
  }
}




function clearCaches(){  
  caches.open('s-app-v1').then(cache => {
    cache.keys().then(keys => {
      keys.forEach(request => {
        cache.delete(request);
      });
    });
  });
}

function clearAllHistory() {

  localStorage.clear(); 

}

function clearCurrentHistory() {

  localStorage.removeItem(currentTest.id); 

}



window.addEventListener("load", ()=>{

   //loadSettings();
   document.body.className = 'light-theme';

  loadSettings();
  // testList.push(test);
  //document.body.className = 'light-theme';

  
  
  const testList = getTestList()
  
  //
  createTestButtons(testList)



});

function getTestList() {  

  const newTests = {
    b5 : [b5, "База 5р"],     
    s5 : [s5, "Стандарт 5р"],
    e5 : [e5, "Эксперт 5р"],    
    b6 : [b6, "База 6р"],
    s6 : [s6, "Стандарт 6р"],
    e6 : [e6, "Эксперт 6р"],
    econs : [econs, "Эконс"],
    econsadded : [econsAdded, "Эконс новые"],
  }    
  const oldTests = {
    level5b : [test5b, "Стандарт 5р"],     
    level6b : [test6b, "Стандарт 6р"],
    level6e : [test6e, "Эксперт 6р"],
    ot : [testOt, "Охрана труда 1"],
    otmaxim : [testMaxim, "Охрана труда 2"],    
    micro5 : [micro5, "Микротесты 5р"],
    micro6 : [micro6, "Микротесты 6р"],
    // temp-test : [test, "Temmmp"],
  }

  if(isNewBases) {      
    return newTests;    
  }
  else {  
    return oldTests;
  }

}

function createTestButtons(testList){

  

    const testButtons = document.getElementById('levels');

    for(let testId in testList){

      const testButton = document.createElement('button');

     // alert(testId)

      testButton.id = testId;

      testButton.className = "test-button";

      testButton.textContent = testList[testId][1];

      testButtons.appendChild(testButton);

    }

}

function removeButtons() {

  const buttonsDiv = document.getElementById('levels');  
  buttonsDiv.innerHTML = '';
  
}



//////////////////////////????????????

//   let deviceId = localStorage.getItem('deviceId');

//   if (!deviceId) {

//     deviceId = generateDeviceId();
//     localStorage.setItem('deviceId', deviceId);

//   }

// }




// function showHistoryDropdown(){

//   //document.getElementById("dropDown-History").style.display = "block";
//  // document.getElementById("dropDown-History").classList.toggle("visible");

// }

// function showMenu() {

//   //let isMenuShown = document.getElementById("dropDownMenu").classList.toggle("visible");
//   document.getElementById("dropDownMenu").style.display = "block";

//   // if(isMenuShown === false){

//   //   saveSettings();

//   // }

// }

// function hideMenu() { 

//   document.getElementById("dropDownMenu").style.display = "none"; 

//   saveSettings();

//   removeButtons();

//   const testList = getTestList();
 
//   createTestButtons(testList);
  
// }

function showHideMenu() {

  
  // let display = window.getComputedStyle(mainMenu).display;

  let display = mainMenu.style.display;

  if(display === "none")
  {
    mainMenu.style.display = "block";
  }
  else {

    mainMenu.style.display = "none";

    //document.getElementById("levels").style.display = "block";

    mainPage.style.display = "block";

    saveSettings();

    removeButtons();

    const testList = getTestList();

    createTestButtons(testList);
  }
  
  
}





function hideHelpPage() {

  document.getElementById("help-page").style.display = "none"; 
  showBlocks();

}

function showHelpPage() {

  document.getElementById("help-page").style.display = "block"; 
  // document.getElementById("dropDownMenu").style.display = "none";
  // document.getElementById("levels").style.display = "none"; 

  hideBlocks();  

}



function loadSettings(){

  if(!localStorage.getItem('settings'))  return

  let togglesState = JSON.parse(localStorage.getItem('settings'));  

  apply(togglesState);

}

function apply(togglesState){  

  document.getElementById('theme-toggle').checked = togglesState.isDarkTheme; 
  document.getElementById('shuffle-toggle').checked = togglesState.isShuffle;
  document.getElementById('learn-mode-toggle').checked = togglesState.isLearn;
  document.getElementById('new-bases-toggle').checked = togglesState.isNewBases;

  isLearnMode = togglesState.isLearn;
  isShuffle = togglesState.isShuffle;
  isNewBases = togglesState.isNewBases;

  if (togglesState.isDarkTheme == true) { 

    //document.documentElement.setAttribute('theme', 'dark');
    document.body.className = 'dark-theme';
  }
  else {

     //document.documentElement.removeAttribute('theme'); 
    document.body.className = 'light-theme';
  }



}


// document.getElementById('themeToggle').addEventListener('click', function() {
//     // Этот код будет выполняться при каждом клике на кнопку

//     // Получаем текущий класс, заданный для элемента body (текущую тему)
//     const currentTheme = document.body.className;

//     // Проверяем, является ли текущая тема светлой
//     if (currentTheme === 'light-theme') {
//         // Если да, меняем тему на темную
//         document.body.className = 'dark-theme';
//     } else {
//         // Если текущая тема не светлая (или отсутствует), устанавливаем светлую тему
//         document.body.className = 'light-theme';
//     }
// });

function saveSettings(){  

  const togglesState = {
   // isHistory:document.getElementById('save-history-toggle').checked,
    isLearn:document.getElementById('learn-mode-toggle').checked,
    isShuffle:document.getElementById('shuffle-toggle').checked,
    isDarkTheme:document.getElementById('theme-toggle').checked,
    isNewBases:document.getElementById('new-bases-toggle').checked,
  }

  apply(togglesState);

  localStorage.setItem("settings", JSON.stringify(togglesState));
}

// function generateDeviceId() {
//   // generate a random string
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }

// function temp() {

//   // let ts = test
//   // //alert(ts[0][1].length)

//   // for (var i = 0; i < ts.length; ++i) {
    
//   //   if (ts[0][1].length != 4) {

//   //     alert(ts[0][1].length + "  --> " +  (i+1))
      
//   //   }

    
//   // }

//   // alert("Ok")

// }

function rem() {

  let date = new Date();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();

  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();

  alert(`${hour}:${minute}-${day}.${month}.${year}`);

  
  
}

///////////////////////////////////////////////////////////////////////////

//открыть страницу поиска
// function showSearchPage() {  

//   document.getElementById("search-page").style.display = "block"; 
//   // document.getElementById("dropDownMenu").style.display = "none";
//   // document.getElementById("levels").style.display = "none"; 
//   hideBlocks();

//   const currentTestList = getTestList();
  
//   fillTestsList(currentTestList);  

//  // removeQuestionButtons('qust-btn-container');

// }

// //закрыть страницу поиск
// function hideSearchPage() {

//   clearQuestionBlock('qust-btn-container');

//   document.getElementById("search-page").style.display = "none";   
//   showBlocks();

// }

//открыть/закрыть страницу поиска
function showHideSearchPage() {  

  let display = searchPage.style.display;
  
  if(display === "block") {   

    clearQuestionBlock('qust-btn-container');

    searchPage.style.display = "none";   
    showBlocks();

  } else {   

    searchPage.style.display = "block";   
    hideBlocks();
    const currentTestList = getTestList();  
    fillTestsList(currentTestList);  

  }

}

// function showProfilePage() {

//   //alert("ddd")

//   // document.getElementById("profile-page").style.display = "block"; 
//   // document.getElementById("dropDownMenu").style.display = "none";
//   // document.getElementById("levels").style.display = "none"; 
//   //hideMenu();
//   profilePage.style.display = "block";
//   hideBlocks();


// }

// function hideProfilePage() {

//   // document.getElementById("profile-page").style.display = "none"; 
//   //document.getElementById("dropDownMenu").style.display = "block";
//   mainMenu.style.display = "block";
//   profilePage.style.display = "none";

   
//   //alert('hhh')

// }

function showHideProfilePage() {

  let display = profilePage.style.display;
  
  if(display === "block") {   

    profilePage.style.display = "none"; 
    mainMenu.style.display = "block";

  } else {   

    profilePage.style.display = "block";
    hideBlocks();
  }

}



function hideBlocks() {
 
  mainMenu.style.display = "none";
  mainPage.style.display = "none";
  header.style.display = "none";

}

function showBlocks() {

  mainMenu.style.display = "block";
  mainPage.style.display = "block";
  header.style.display = "flex";

}

function showHideHisotryMenu() { 
  
  let display = historyMenu.style.display;
  
  if(display == "block") {   
    historyMenu.style.display = "none"; 
  } else {    
    historyMenu.style.display = "block";
  }
 
}



  

