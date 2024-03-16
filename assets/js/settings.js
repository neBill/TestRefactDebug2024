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
    econs_added : [econs_added, "Эконс новые"],
  }    
  const oldTests = {
    level_5b : [test_5b, "Стандарт 5р"],     
    level_6b : [test_6b, "Стандарт 6р"],
    level_6e : [test_6e, "Эксперт 6р"],
    ot : [test_ot, "Охрана труда 1"],
    ot_maxim : [test_maxim, "Охрана труда 2"],    
    micro_5 : [micro_5, "Микротесты 5р"],
    micro_6 : [micro_6, "Микротесты 6р"],
    // temp_test : [test, "Temmmp"],
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

      testButton.className = "test_button";

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


function showHistoryDropdown(){

  //document.getElementById("dropDown_History").style.display = "block";
  document.getElementById("dropDown_History").classList.toggle("visible");
}

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

  const ddMenu = document.getElementById("dropDownMenu");
  let display = window.getComputedStyle(ddMenu).display;
  if(display === "none")
  {
      ddMenu.style.display = "block";
  }
  else {

    ddMenu.style.display = "none";
    saveSettings();

    removeButtons();

    const testList = getTestList();

    createTestButtons(testList);
  }
  
  
}





function hideHelpPage() {

  document.getElementById("help_block").style.display = "none"; 
  //alert('hhh')

}

function showHelpPage() {

  document.getElementById("help_block").style.display = "block"; 
  showHideMenu();

}



function loadSettings(){

  if(!localStorage.getItem('settings'))  return

  let togglesState = JSON.parse(localStorage.getItem('settings'));  

  apply(togglesState);

}

function apply(togglesState){  

  document.getElementById('theme_toggle').checked = togglesState.isDarkTheme; 
  document.getElementById('shuffle_toggle').checked = togglesState.isShuffle;
  document.getElementById('learn_mode_toggle').checked = togglesState.isLearn;
  document.getElementById('new_bases_toggle').checked = togglesState.isNewBases;

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
   // isHistory:document.getElementById('save_history_toggle').checked,
    isLearn:document.getElementById('learn_mode_toggle').checked,
    isShuffle:document.getElementById('shuffle_toggle').checked,
    isDarkTheme:document.getElementById('theme_toggle').checked,
    isNewBases:document.getElementById('new_bases_toggle').checked,
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

function showProfilePage() {

  //alert("ddd")

  document.getElementById("profile_block").style.display = "block"; 

  const currentTestList = getTestList();
  
  fillTestsList(currentTestList);
 
  //hideMenu();

}

function hideProfilePage() {

  document.getElementById("profile_block").style.display = "none"; 
  //alert('hhh')

}


