function roll(dice, wp, rote, again){
  let roll = []; //blanc array for main roll
  let successes = 0;

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

return [roll, successes];
}

function reroller(again){
  let reRoll = []
  
  reRoll[0] = Math.ceil(Math.random() * 10);

  if(reRoll[reRoll.length-1] === 0){
    reRoll[reRoll.lenght-1] = 10;
  }

  if(reRoll[0] >= again && again){
    let recall = reroller(again);
    reRoll = reRoll.concat(recall);
  }

  return reRoll
}

function chanceRoll(){
  let roll = Math.ceil(Math.random() * 10);
  let result;

  if(roll === 0){
    roll = 10;
  }

  console.log('roll: '+roll);

  if(roll === 10){
    result = 'success';
  }else if(roll<= 9 && roll>=2){
    result = 'fail';
  }else{
    result = 'dramatic fail';
  }

  console.log('result: '+result);

  return [roll, result];

}

let rollForm = document.getElementById('rollForm')

rollForm.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('%c------------------New Roll------------------', 'background: #89CFF0;')
  let playerName = document.getElementById('playerName')
  console.log('Player Name: '+ playerName.value)
  let description = document.getElementById('rollDescription')
  console.log('Description: '+ description.value)

  if(e.submitter.id === 'regRoll'){
    let dice = document.getElementById('dice')
    console.log('Dice pool: '+ dice.value)

    if(playerName.value == '' || description.value == '' || dice.value <= 0){
      alert('Be sure to fill in Player Name, Desctiption and Dice Pool for normal rolls');
    }else{
      let again;
      let agains = document.querySelectorAll('input[name="agains"]');
      agains.forEach(x =>{ if(x.checked){ again = parseInt(x.value)}});
      console.log('Again: '+again);
      let rote = document.getElementById('rote');
      console.log('Rote: '+rote.checked);
      let wp = document.getElementById('willpower');
      console.log('Willpower: '+wp.checked);
      roll(parseInt(dice.value), wp.checked, rote.checked, again);

    }

  }else if(e.submitter.id === 'chanceRoll'){

    if(playerName.value == '' || description.value == ''){
      alert('Be sure to fill in Player Name and Desctiption for chance rolls');
    }else{
      chanceRoll();
    }

  }else if(e.submitter.id === 'initiativeRoll'){

    if(playerName.value == ''){
      alert('Be sure to fill in Player Name for initiative rolls');
    }

  }
})
