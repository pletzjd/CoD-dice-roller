function Roll(dice, rote, again, wp){
    let roll = [];

    let successes = 0;
    let fails = 0;

    let ten = 0;
    let nine = 0;
    let eight = 0;

    if(wp){
        dice=dice+3;
    }

      for(let i=0;i<dice;i++){
        roll[i]=Math.ceil(Math.random()*10);
        if(roll[i]<=7){
          fails++;
        }else if (roll[i]===8){
          successes++;
          eight++;
        }else if(roll[i]===9){
          successes++
          nine++
        }else{
          successes++
          ten++
        }
      }
      
      
  }