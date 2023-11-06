function roll(dice, wp, rote, again){
  let roll = []; //blanc array for main roll
  let successes = 0;
  console.log('roll: '+roll)

  if (wp) {
    dice = dice + 3;
  }

  for (let i = 0; i < dice; i++) {
    
    roll.push(Math.ceil(Math.random() * 10));

    if(roll[roll.length-1] === 0){
      roll[roll.lenght-1] = 10;
    }
    
    console.log('roll: '+roll)
  

    if (roll[roll.length-1] === 8 && again === 8) {
      roll = roll.concat(reroller(again));
      console.log('8-again reroll: '+roll)
    } else if (roll[roll.length-1] === 9 && 8 <= again && again <= 9) {
      roll = roll.concat(reroller(again))
      console.log('9-again reroll: '+roll)
    } else if(roll[roll.length-1] === 10 && 8 <= again) {
      roll = roll.concat(reroller(again))
      console.log('10-again reroll: '+roll)
    }

    if (roll[roll.length-1] <= 7 && rote) {
      console.log('rote')
      roll = roll.concat(reroller(again));
      console.log('rote roll: '+roll)
    } 

  }
console.log('result: '+ roll)
roll.forEach(x => { if( x >=8 ){ successes++ } })
console.log('successes: '+ successes)
}

function reroller(again){
  let reRoll = []
  
  reRoll[0] = Math.ceil(Math.random() * 10);

  if(reRoll[reRoll.length-1] === 0){
    reRoll[reRoll.lenght-1] = 10;
  }

  if(reRoll[0] >= again && again){
    let recall = reroller(again);
    reRoll = reRoll.concat(recall)
  }

  return reRoll
}

let rollForm = document.getElementById('rollForm')

rollForm.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('------------------New Roll------------------')
  let playerName = document.getElementById('playerName')
  console.log('Player Name: '+ playerName.value)
  let description = document.getElementById('rollDescription')
  console.log('Description: '+ description.value)
  let dice = document.getElementById('dice')
  console.log('Dice pool: '+ dice.value)

  if(e.submitter.id === 'regRoll'){
    if(playerName.value == '' || description.value == '' || dice.value <= 0){
      alert('Be sure to fill in Player Name, Desctiption and Dice Pool')
      return
    }else{
      let again
      let agains = document.querySelectorAll('input[name="agains"]')
      agains.forEach(x =>{ if(x.checked){ again = parseInt(x.value)}})
      console.log('Again: '+again)
      let rote = document.getElementById('rote')
      console.log('Rote: '+rote.checked)
      let wp = document.getElementById('willpower')
      console.log('Willpower: '+wp.checked)
      roll(parseInt(dice.value), wp.checked, rote.checked, again)

    }
  }
})
