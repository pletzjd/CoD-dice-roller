function roll(dice, rote, again, wp){
    let roll = [];
    let roteReRoll = [];

    let successes = 0;
    let fails = 0;

    let ten = 0;
    let nine = 0;
    let eight = 0;
    let roteTen = 0;
    let roteNine = 0;
    let roteEight = 0;

    if(wp){
        dice = dice + 3;
    }

      for(let i=0;i<dice;i++){
        roll[i]=Math.ceil(Math.random()*10);
        if(roll[i]<=7){
          fails++;
        }else if (roll[i]===8){
          successes++;
          eight++;
        }else if(roll[i]===9){
          successes++;
          nine++;
        }else{
          successes++;
          ten++;
        }
      }

      if(rote){
        let originalFails = fails;
        for(let j=0;j<originalFails;j++){
          roteReRoll[j]=Math.ceil(Math.random()*10);
          if(roll[j]<=7){
            fails++;
          }else if (roll[j]===8){
            successes++;
            roteEight++;
          }else if(roll[j]===9){
            successes++;
            roteNine++;
          }else{
            successes++;
            roteTen++;
          }
        }
      }
      
      console.log('roll: '+ roll +' successes: '+ successes +' fails: '+ fails +' tens: '+ ten +' nines: '+ nine +' eights: '+ eight)
      console.log('rote: '+ roteReRoll +' rote tens: '+ roteTen +' rote nines: '+ roteNine +' rote eights: '+ roteEight )
  }

roll(10, true, false, false)