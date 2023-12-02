function roll(dice, wp, rote, again) {
  let roll = []; //blanc array for main roll
  let successes = 0;

  if (wp) {
    dice = dice + 3;
  }

  for (let i = 0; i < dice; i++) {

    roll.push(singleRoll());

    console.log('roll: ' + roll)


    if (roll[roll.length - 1] === 8 && again === 8) {
      roll = roll.concat(reroller(again));
      console.log('8-again reroll: ' + roll)
    } else if (roll[roll.length - 1] === 9 && 8 <= again && again <= 9) {
      roll = roll.concat(reroller(again))
      console.log('9-again reroll: ' + roll)
    } else if (roll[roll.length - 1] === 10 && 8 <= again) {
      roll = roll.concat(reroller(again))
      console.log('10-again reroll: ' + roll)
    }

    if (roll[roll.length - 1] <= 7 && rote) {
      console.log('rote')
      roll = roll.concat(reroller(again));
      console.log('rote roll: ' + roll)
    }

  }
  console.log('result: ' + roll)

  roll.forEach(x => { if (x >= 8) { successes++ } })
  console.log('successes: ' + successes)

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

  console.log('roll: ' + roll);

  if (roll === 10) {
    result = 'success';
  } else if (roll <= 9 && roll >= 2) {
    result = 'fail';
  } else {
    result = 'dramatic fail';
  }

  console.log('result: ' + result);

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
  console.log('%c------------------New Roll------------------', 'background: #89CFF0;')
  let timeStamp = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log('rolled at: ' + timeStamp)
  let playerName = document.getElementById('playerName').value
  console.log('Player Name: ' + playerName)
  let description = document.getElementById('rollDescription').value
  let rollObj;


  if (e.submitter.id === 'regRoll') {
    let rollResult;
    console.log('Description: ' + description)
    let dice = parseInt(document.getElementById('dice').value)
    console.log('Dice pool: ' + dice)

    if (!playerName || !description || !dice || dice <= 0) {
      alert('Be sure to fill in Player Name, Desctiption and Dice Pool for normal rolls');
      return;
    } else {
      let again;
      let agains = document.querySelectorAll('input[name="agains"]');
      agains.forEach(x => { if (x.checked) { again = parseInt(x.value) } });
      console.log('Again: ' + again);
      let rote = document.getElementById('rote').checked;
      console.log('Rote: ' + rote);
      let wp = document.getElementById('willpower').checked;
      console.log('Willpower: ' + wp);
      let advanced = document.getElementById('advanced').checked;

      if (advanced) {
        let rollOne = roll(dice, wp, rote, again);
        let rollTwo = roll(dice, wp, rote, again);

        console.log('Roll 1: ' + rollOne[0]);
        console.log('Roll 2: ' + rollTwo[0]);
        console.log('Roll 1 successes: ' + rollOne[1]);
        console.log('Roll 2 successes: ' + rollTwo[1]);

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

        console.log(rollObj)

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

        console.log(rollObj)
      }
    }

  } else if (e.submitter.id === 'chanceRoll') {
    console.log('Description: ' + description)

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
        rollOne: rollResult.toString(),
        rollTwo: null,
        rollOneSuccesses: rollResult[1],
        rollTwoSuccesses: null
      }
      console.log(rollObj);
    }

  } else if (e.submitter.id === 'initiativeRoll') {

    if (!playerName) {
      alert('Be sure to fill in Player Name for initiative rolls');
      return;
    } else {
      description = 'Initiative';
      console.log('Description: ' + description);
      rollResult = singleRoll();
      console.log('roll: ' + rollResult);

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
      console.log(rollObj);
    }

  }

  fetch('http://localhost:3001/api/roll', {
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
    .then(function (data) {
      console.log(data);
    });

  location.reload()
})

function tableRowMaker(rollObj) {
  //Creating all the elements to be added to the table
  let rollTable = document.getElementById('rollTable')
  let newRow = document.createElement('tr');
  let timeStampColumn = document.createElement('td');
  let playerNameColumn = document.createElement('td');
  let rollDescriptionColumn = document.createElement('td');
  let diceColumn = document.createElement('td');
  let modifiersColumn = document.createElement('td');
  let rollColumn = document.createElement('td');
  let successesColumn = document.createElement('td');

  // Modifies content from roll object to be added as text content later
  console.log(typeof rollObj.createdAt);
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
  diceColumn.textContent = rollObj.dice;
  modifiersColumn.textContent = modifiersContent;
  if (rollObj.advanced) {
    //Additonal elements for advanced action
    let rollOneRollElement = document.createElement('p');
    let rollOneSuccessesElement = document.createElement('p');
    let rollTwoRollElement = document.createElement('p');
    let rollTwoSuccessesElement = document.createElement('p');

    //Roll 1
    //Modifies rollObj
    let rollOne = rollObj.rollOne.split(',');
    let wasRoteReRoll = false;
    let wasAgainReRoll = false;

    //Creates and appends a span element for each number rolled
    rollOne.forEach((roll, index, arr) => {
      let spanElement = document.createElement('span');
      spanElement.textContent = roll;

      //Checks if this roll is due to a reroll
      //spanElement.setAttribute('class', 'roteReroll');
      if (arr[index-1] >= rollObj.again && index-1 >=0) {
        spanElement.setAttribute('class', 'againReroll');
        wasRoteReRoll = false;
        wasAgainReRoll = true;
      } else if (rollObj.rote && arr[index-1] <= 7 && index-1 >= 0) {
        // console.log(arr)
        if(index-2 >= 0 && arr[index-2] <= rollObj.again && !wasRoteReRoll && !wasAgainReRoll){
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

      //Check if this roll cause a success
      if (parseInt(roll) === 10 || parseInt(roll) === 9 || parseInt(roll) === 8) {
        let spanAttribute = spanElement.getAttribute('class')
        if(!spanAttribute){
          spanAttribute = ''
        }
        spanElement.setAttribute('class', spanAttribute.concat(' success').trim());
      }

      rollOneRollElement.appendChild(spanElement)
      //Adds a , after each number if its not the last iteration
      if (index != arr.length - 1) {
        rollOneRollElement.innerHTML += ', '
      }
    });

    rollOneSuccessesElement.textContent = rollObj.rollOneSuccesses

    //Roll 2
    //Modifies rollObj
    let rollTwo = rollObj.rollTwo.split(',');

    //initializes variables for following foreach call
    wasRoteReRoll = false;
    wasAgainReRoll = false;

    //Creates and appends a span element for each number rolled
    rollTwo.forEach((roll, index, arr) => {
      let spanElement = document.createElement('span');
      spanElement.textContent = roll;

      //Checks if this roll is due to a reroll
      if (arr[index-1] >= rollObj.again && index-1 >=0) {
        spanElement.setAttribute('class', 'againReroll');
        wasRoteReRoll = false;
        wasAgainReRoll = true;
      } else if (rollObj.rote && arr[index-1] <= 7 && index-1 >= 0) {
        // console.log(arr)
        if(index-2 >= 0 && arr[index-2] <= rollObj.again && !wasRoteReRoll && !wasAgainReRoll){
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

      //Check if this roll cause a success
      if (parseInt(roll) === 10 || parseInt(roll) === 9 || parseInt(roll) === 8) {
        let spanAttribute = spanElement.getAttribute('class')
        if(!spanAttribute){
          spanAttribute = ''
        }
        spanElement.setAttribute('class', spanAttribute.concat(' success').trim());
      }

      rollTwoRollElement.appendChild(spanElement)
      //Adds a , after each number if its not the last iteration
      if (index != arr.length - 1) {
        rollTwoRollElement.innerHTML += ', '
      }
    });

    rollTwoSuccessesElement.textContent = rollObj.rollTwoSuccesses

    rollColumn.appendChild(rollOneRollElement)
    rollColumn.appendChild(rollTwoRollElement)
    successesColumn.appendChild(rollOneSuccessesElement)
    successesColumn.appendChild(rollTwoSuccessesElement)
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

  fetch('http://localhost:3001/api/roll')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      data.forEach((rollObj) => {
        console.log(rollObj)
        if(rollObj){
          tableRowMaker(rollObj)
        }
      })
    })
}

init()