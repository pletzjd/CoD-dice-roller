function roll(dice, wp, rote, again){
  let roll = []; //blanc array for main roll
  console.log('roll: '+roll)

  if (wp) {
    dice = dice + 3;
  }

  for (let i = 0; i < dice; i++) {
    
    roll.push(Math.ceil(Math.random() * 10));
    console.log('roll: '+roll)
  
    if (roll[roll.length-1] <= 7) {
      if(rote){
        console.log('rote')
        roll = roll.concat(reroller(again))
        console.log('roll: '+roll)
      }
    } else if (roll[roll.length-1] === 8) {
      if(again === 8){
        roll = roll.concat(reroller(again))
      }
      
    } else if (roll[roll.length-1] === 9) {
      if(8<=again && again<=9){
        roll = roll.concat(reroller(again))
      }
    } else {
      if(8<=again){
        roll = roll.concat(reroller(again))
      }
    }
  }
console.log('final roll: '+ roll)
console.log(roll)
}

function reroller(again){
  let reRoll = []
  
  reRoll[0] = Math.ceil(Math.random() * 10);

  if(reRoll[0] >= again && again){
    let recall = reroller(again);
    reRoll = reRoll.concat(recall)
  }

  return reRoll
}

roll(5,false,false,8)