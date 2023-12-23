// Functions
// Rolls a sigle die and determines what the result means in the context of a normal roll
function roll(dice, wp, rote, again) {
  let roll = [];
  let successes = 0;

  //Adds three dice to the roll if willpower was used
  if (wp) {
    dice = dice + 3;
  }

  // Rolls all the dice
  for (let i = 0; i < dice; i++) {

    roll.push(singleRoll());

    // Handles exploding dice rerolls and rote action rerolls
    if (roll[roll.length - 1] >= again && again) {
      roll = roll.concat(reroller(again));
    }else if (roll[roll.length - 1] <= 7 && rote) {
      roll = roll.concat(reroller(again));
    }
  }

  // Counts the number of successes from the roll
  roll.forEach(x => { if (x >= 8) { successes++ } })

  return [roll, successes];
}

// Handles exploding dice rerolls
function reroller(again) {
  let reRoll = []

  reRoll[0] = singleRoll();

  // Continues rerolling if new reroll triggers exploding dice
  if (reRoll[0] >= again && again) {
    let recall = reroller(again);
    reroll = reRoll.concat(recall);
  }

  return reRoll
}

// Rolls a sigle die and determines what the result means in the context of a chance die roll
function chanceRoll() {
  let roll = singleRoll();
  let result;

  // Determines meaning of chance die roll
  if (roll === 10) {
    result = 'Success';
  } else if (roll <= 9 && roll >= 2) {
    result = 'Fail';
  } else {
    result = 'Dramatic Fail';
  }

  return [roll, result];

}

// Rolls a single 10 sided dice
function singleRoll() {
  // Rolls one die
  let roll = Math.ceil(Math.random() * 10);

  // Sets a roll resulting in 0 to 10
  if (roll === 0) {
    roll = 10;
  }

  return roll
}

// Adds styling to each number in a roll to better visualize the significance of each number in the roll
function rollParser(roll, type, again, rote){

  if(!again){
    again = 11;
  }

  let rollElement = document.createElement('p');

  roll = roll.split(',');
  let wasRoteReRoll = false;
  let wasAgainReRoll = false;

  roll.forEach((elem, index, arr) => {
    let spanElement = document.createElement('span');
    spanElement.textContent = elem;

    //Checks if this roll is due to a reroll
    if(index-1 >= 0){
      if (arr[index-1] >= again) {
        spanElement.setAttribute('class', 'againReroll');
        wasRoteReRoll = false;
        wasAgainReRoll = true;
      } else if (rote && arr[index-1] <= 7) {
        if(index-2 >= 0 && arr[index-2] <= again && !wasRoteReRoll && !wasAgainReRoll){
          spanElement.setAttribute('class', 'roteReroll');
          wasRoteReRoll = true;
          wasAgainReRoll = false;
        }else if(index-2 < 0 && !wasRoteReRoll && !wasAgainReRoll){
          spanElement.setAttribute('class', 'roteReroll');
          wasRoteReRoll = true;
          wasAgainReRoll = false
        }else if(wasRoteReRoll || wasAgainReRoll){
          wasRoteReRoll = false;
          wasAgainReRoll = false;
        }
      } else {
        wasRoteReRoll = false;
        wasAgainReRoll = false;
      }
    }

    //Check if this roll cause a success
    if ((parseInt(elem) === 10 && (type === 'reg' || type === 'chance') ) || (parseInt(elem) === 9 && type === 'reg') || (parseInt(elem) === 8 && type === 'reg')) {
      let spanAttribute = spanElement.getAttribute('class')
      if(!spanAttribute){
        spanAttribute = ''
      }
      spanElement.setAttribute('class', spanAttribute.concat(' success').trim());
    }

    rollElement.appendChild(spanElement)

    //Adds a , after each number if its not the last iteration
    if (index != arr.length - 1) {
      rollElement.innerHTML += ', '
    }
  })

  return rollElement
}

// Creates one row of the roll table
function tableRowMaker(rollObj) {
  //Creating all the elements to be added to the table
  let rollTable = document.getElementsByTagName('tbody')[0]
  let newRow = document.createElement('tr');
  let timeStampColumn = document.createElement('td');
  let timeStampLink = document.createElement('a')
  let playerNameColumn = document.createElement('td');
  let rollDescriptionColumn = document.createElement('td');
  let diceColumn = document.createElement('td');
  let modifiersColumn = document.createElement('td');
  let rollColumn = document.createElement('td');
  let successesColumn = document.createElement('td');

  // Modifies content from roll object to be added as text content later
  // Prepares Date Time column
  let timeStampContent = rollObj.createdAt.split('T');
  timeStampContent[1] = timeStampContent[1].split('.')[0];
  timeStampLink.setAttribute('href',`?roll=${rollObj.rollID}`)

  //Prepares modifiers column
  let modifiersContent;
  if (rollObj.again === 10) {
    modifiersContent = '10-Again'
  } else if (rollObj.again === 9) {
    modifiersContent = '9-Again'
  } else if (rollObj.again === 8) {
    modifiersContent = '8-Again'
  } else if(rollObj.again === 0) {
    if(rollObj.rollType === 'reg'){
      modifiersContent = 'No Re-rolls'
    }else if(rollObj.rollType === 'chance'){
      modifiersContent = 'Chance Die'
    }else(
      modifiersContent = 'Initiative Roll'
    )
  }
  if (rollObj.willpower) {
    modifiersContent = modifiersContent.concat(', Use Willpower')
  }
  if (rollObj.rote) {
    modifiersContent = modifiersContent.concat(', Rote')
  }
  if (rollObj.advanced) {
    modifiersContent = modifiersContent.concat(', Advanced Action')
  }

  //Adding content to table elements
  timeStampLink.textContent = `${timeStampContent[0]}, ${timeStampContent[1]}`;
  timeStampColumn.appendChild(timeStampLink)
  playerNameColumn.textContent = rollObj.playerName;
  rollDescriptionColumn.textContent = rollObj.description;
  if(rollObj.willpower){
    diceColumn.textContent = rollObj.dice + 3;
  }else{
    diceColumn.textContent = rollObj.dice;
  }
  modifiersColumn.textContent = modifiersContent;

  let rollOneRollElement = rollParser(rollObj.rollOne, rollObj.rollType, rollObj.again, rollObj.rote)
  let rollOneSuccessesElement = document.createElement('p');

  rollColumn.appendChild(rollOneRollElement)
  rollOneSuccessesElement.textContent = rollObj.rollOneSuccesses
  successesColumn.appendChild(rollOneSuccessesElement)

  // Adds additonal elements to roll column and success column for advanced action rolls
  if (rollObj.advanced) {
    // Additonal elements for advanced action.
    let rollTwoRollElement = rollParser(rollObj.rollTwo, rollObj.rollType, rollObj.again, rollObj.rote)
    let rollTwoSuccessesElement = document.createElement('p');
    let rollSpacer = document.createElement('p');
    let successSpacer = document.createElement('p')
    rollColumn.appendChild(rollSpacer)
    successesColumn.appendChild(successSpacer)

    rollOneRollElement.setAttribute('class', 'rollOne');
    rollOneSuccessesElement.setAttribute('class', 'successOne')

    rollTwoRollElement.setAttribute('class', 'rollTwo')
    rollTwoSuccessesElement.setAttribute('class', 'successTwo')

    rollTwoSuccessesElement.textContent = rollObj.rollTwoSuccesses

    rollColumn.appendChild(rollTwoRollElement)
    successesColumn.appendChild(rollTwoSuccessesElement)
  }else{
    rollOneRollElement.setAttribute('class', 'singleRoll');
    rollOneSuccessesElement.setAttribute('class', 'singleSuccess')
  }



  //Append all the elements to table
  newRow.appendChild(timeStampColumn);
  newRow.appendChild(playerNameColumn);
  newRow.appendChild(rollDescriptionColumn);
  newRow.appendChild(diceColumn);
  newRow.appendChild(modifiersColumn);
  newRow.appendChild(rollColumn);
  newRow.appendChild(successesColumn);
  rollTable.appendChild(newRow)
}

// Populates the roll table and creates buttons for page navigation
function init() {
  // Determines the current page
  let queryString;
  if(!document.location.search){
    queryString = '?page=1'
  }else{
    queryString = document.location.search
  }

  // Sets up page navigation
  fetch('/api/roll/pages')
  .then((function (response){
    return response.json()
  }))
  .then(function (data){
    let rows = data
    let pageTotal = Math.ceil(rows/25)
    let tableNav = document.getElementById('tableNav')
    let prevTab = document.createElement('button')
    prevTab.innerHTML = 'PREV'
    let pageNumber = parseInt(document.location.search.split('page=')[1]) || 1
    let prevTabHRef

    // Creates the previous page button. Sets location for the Previous button to bring the user too. Disables button if this is the first page
    if(pageNumber >=2 ){
      prevTabHRef = `?page=${pageNumber-1}`
    }else{
      prevTab.setAttribute('disabled', 'True')
      prevTabHRef = ''
    }
    prevTab.setAttribute('href', prevTabHRef)
    prevTab.setAttribute('class', 'tableNavButton')
    tableNav.appendChild(prevTab)

    // Creates buttons to navigate to a specific page. Gives special styling to the button of the current page and disables it.
    for(let i =1; i <= pageTotal; i++){
      let newNavTab = document.createElement('button')
      newNavTab.innerHTML = i
      newNavTab.setAttribute('href', `?page=${i}`)
      if(i === pageNumber){
        newNavTab.setAttribute('class', 'currentPage numberNav')
        newNavTab.setAttribute('disabled', 'True')
      }else{
        newNavTab.setAttribute('class', 'numberNav')
      }
      tableNav.appendChild(newNavTab)
    }

    // Creates the buttons to navigate to the next page and disables it if the current page is the last page.
    let nextTab = document.createElement('button')
    nextTab.innerHTML = 'NEXT'
    nextTab.setAttribute('class','tableNavButton')
    let nextTabHRef
    if(pageNumber < pageTotal && document.location.search.split('page=')[1]){
      nextTabHRef = `?page=${parseInt(document.location.search.split('page=')[1]) + 1}`
    }else if(pageNumber === pageTotal){
      nextTab.setAttribute('disabled', 'True')
      nextTabHRef = ''
    }else {
      nextTabHRef = '?page=2'
    }
    nextTab.setAttribute('href', nextTabHRef)
    tableNav.appendChild(nextTab)
  })
  .catch((err) => {
    console.log(err.message)
  })

  // Gets the roll data for the table and then creates each row
  fetch(`/api/roll${queryString}`)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    if (queryString.split('=')[0] === '?page'){
      data.forEach((rollObj) => {
        tableRowMaker(rollObj)
      })
    }else(
      tableRowMaker(data)
    )
  })
  .catch((err) => {
    console.log(err.message)
  })
}

// EVENT LISTENERS
// Event listener for handling submission of the roll form for all the various roll types
let rollForm = document.getElementById('rollForm')
rollForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let rollObj;
  // Gets information common to all roll types from the form
  let playerName = document.getElementById('playerName').value
  let description = document.getElementById('rollDescription').value

  // Handles submission for the roll button
  if (e.submitter.id === 'regRoll') {
    let rollResult;
    let dice = parseInt(document.getElementById('dice').value)

    //check to make sure all necessary fields are filled in with proper data
    if (!playerName || !description || !dice || dice <= 0) {
      alert('Be sure to fill in Player Name, Desctiption and Dice Pool for normal rolls');
      return;
    } else {
      // Gets information from form for a regular roll
      let again;
      let agains = document.querySelectorAll('input[name="agains"]');
      agains.forEach(x => { if (x.checked) { again = parseInt(x.value) } });
      let rote = document.getElementById('rote').checked;
      let wp = document.getElementById('willpower').checked;
      let advanced = document.getElementById('advanced').checked;

      // Checks if HTML of form elements was altered
      if(typeof wp != 'boolean' || typeof rote != 'boolean' || (again != 0 && again != 10 && again != 9 && again != 8 || typeof dice != 'number' || isNaN(dice))){
        return
      }

      // Rolls dice and creates object to be sent in the body of the request to add this roll to the database
      if (advanced) {
        let rollOne = roll(dice, wp, rote, again);
        let rollTwo = roll(dice, wp, rote, again);

        rollObj = {
          rollType: 'reg',
          playerName: playerName,
          description: description,
          dice: dice,
          willpower: wp,
          again: again,
          rote: rote,
          advanced: advanced,
          rollOne: rollOne[0].toString(),
          rollTwo: rollTwo[0].toString(),
          rollOneSuccesses: rollOne[1].toString(),
          rollTwoSuccesses: rollTwo[1]
        }
      } else {
        rollResult = roll(dice, wp, rote, again);

        rollObj = {
          rollType: 'reg',
          playerName: playerName,
          description: description,
          dice: dice,
          willpower: wp,
          again: again,
          rote: rote,
          advanced: advanced,
          rollOne: rollResult[0].toString(),
          rollTwo: null,
          rollOneSuccesses: rollResult[1].toString(),
          rollTwoSuccesses: null
        }
      }
    }

    // Handles submission for the Chance Die button
  } else if (e.submitter.id === 'chanceRoll') {

    //check to make sure all necessary fields are filled in with proper data
    if (!playerName || !description) {
      alert('Be sure to fill in Player Name and Desctiption for chance rolls');
      return;
    } else {
      // Rolls dice and creates object to be sent in the body of the request to add this roll to the database
      rollResult = chanceRoll();

      rollObj = {
        rollType: 'chance',
        playerName: playerName,
        description: description,
        dice: 1,
        willpower: false,
        again: 0,
        rote: false,
        advanced: false,
        rollOne: rollResult[0].toString(),
        rollTwo: null,
        rollOneSuccesses: rollResult[1],
        rollTwoSuccesses: null
      }
    }
    // Handles submission for the Initiative button
  } else if (e.submitter.id === 'initiativeRoll') {
    //check to make sure all necessary fields are filled in with proper data
    if (!playerName) {
      alert('Be sure to fill in Player Name for initiative rolls');
      return;
    } else {
      // Rolls dice and creates object to be sent in the body of the request to add this roll to the database
      description = 'Initiative';
      rollResult = singleRoll();

      rollObj = {
        rollType: 'initiative',
        playerName: playerName,
        description: description,
        dice: 1,
        willpower: false,
        again: 0,
        rote: false,
        advanced: false,
        rollOne: rollResult.toString(),
        rollTwo: null,
        rollOneSuccesses: null,
        rollTwoSuccesses: null
      }
    }
  }

  // Adds new roll to database and refreshes the page so it appears in the table
  fetch('/api/roll', {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(rollObj),
  }).then(function (response) {
    return response.json();
  })
  .then(function (){
    location.assign(location.origin)
  })

})

//Event listener to navigate the different pages of the roll table
let tableNav = document.getElementById('tableNav')
tableNav.addEventListener('click', (e) => {
  if(e.target.getAttribute('href')){
    location.search = e.target.getAttribute('href')
  }
})

// Page load function call
init()