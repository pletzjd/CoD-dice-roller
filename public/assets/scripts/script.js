function roll(dice, wp, rote, again) {
  let roll = []; //blanc array for main roll
  let successes = 0;

  if (wp) {
    dice = dice + 3;
  }

  for (let i = 0; i < dice; i++) {

    roll.push(singleRoll());

    if (roll[roll.length - 1] === 8 && again === 8) {
      roll = roll.concat(reroller(again));
    } else if (roll[roll.length - 1] === 9 && 8 <= again && again <= 9) {
      roll = roll.concat(reroller(again))
    } else if (roll[roll.length - 1] === 10 && 8 <= again) {
      roll = roll.concat(reroller(again))
    }else if (roll[roll.length - 1] <= 7 && rote) {
      roll = roll.concat(reroller(again));
    }

  }

  roll.forEach(x => { if (x >= 8) { successes++ } })

  return [roll, successes];
}

function reroller(again) {
  let reRoll = []

  reRoll[0] = singleRoll();

  if (reRoll[0] >= again && again) {
    let recall = reroller(again);
    reRoll = reRoll.concat(recall);
  }

  return reRoll
}

function chanceRoll() {
  let roll = singleRoll();
  let result;

  if (roll === 10) {
    result = 'success';
  } else if (roll <= 9 && roll >= 2) {
    result = 'fail';
  } else {
    result = 'dramatic fail';
  }

  return [roll, result];

}

function singleRoll() {
  let roll = Math.ceil(Math.random() * 10);

  if (roll === 0) {
    roll = 10;
  }

  return roll
}

let rollForm = document.getElementById('rollForm')

rollForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let playerName = document.getElementById('playerName').value
  let description = document.getElementById('rollDescription').value
  let rollObj;


  if (e.submitter.id === 'regRoll') {
    let rollResult;
    let dice = parseInt(document.getElementById('dice').value)

    if (!playerName || !description || !dice || dice <= 0) {
      alert('Be sure to fill in Player Name, Desctiption and Dice Pool for normal rolls');
      return;
    } else {
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

  } else if (e.submitter.id === 'chanceRoll') {

    if (!playerName || !description) {
      alert('Be sure to fill in Player Name and Desctiption for chance rolls');
      return;
    } else {
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

  } else if (e.submitter.id === 'initiativeRoll') {

    if (!playerName) {
      alert('Be sure to fill in Player Name for initiative rolls');
      return;
    } else {
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

function tableRowMaker(rollObj) {
  //Creating all the elements to be added to the table
  let rollTable = document.getElementsByTagName('tbody')[0]
  let newRow = document.createElement('tr');
  let timeStampColumn = document.createElement('td');
  let playerNameColumn = document.createElement('td');
  let rollDescriptionColumn = document.createElement('td');
  let diceColumn = document.createElement('td');
  let modifiersColumn = document.createElement('td');
  let rollColumn = document.createElement('td');
  let successesColumn = document.createElement('td');

  // Modifies content from roll object to be added as text content later
  let timeStampContent = rollObj.createdAt.split('T');
  timeStampContent[1] = timeStampContent[1].split('.')[0];

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
  timeStampColumn.textContent = `${timeStampContent[0]}, ${timeStampContent[1]}`;
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

  if (rollObj.advanced) {
    //Additonal elements for advanced action
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



  //Append all the elements
  newRow.appendChild(timeStampColumn);
  newRow.appendChild(playerNameColumn);
  newRow.appendChild(rollDescriptionColumn);
  newRow.appendChild(diceColumn);
  newRow.appendChild(modifiersColumn);
  newRow.appendChild(rollColumn);
  newRow.appendChild(successesColumn);
  rollTable.appendChild(newRow)

}

function init() {
  let queryString;
  if(!document.location.search){
    queryString = '?page=1'
  }else{
    queryString = document.location.search
  }

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

    if(pageNumber >=2 ){
      prevTabHRef = `?page=${pageNumber-1}`
    }else{
      prevTab.setAttribute('disabled', 'True')
      prevTabHRef = ''
    }

    prevTab.setAttribute('href', prevTabHRef)
    prevTab.setAttribute('class', 'tableNavButton')
    tableNav.appendChild(prevTab)

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

  fetch(`/api/roll${queryString}`)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    data.forEach((rollObj) => {
      if(rollObj){
        tableRowMaker(rollObj)
      }
    })
  })
  .catch((err) => {
    console.log(err.message)
  })
}

let tableNav = document.getElementById('tableNav')
tableNav.addEventListener('click', (e) => {
  if(e.target.getAttribute('href')){
    location.search = e.target.getAttribute('href')
  }
})

init()