function roll(dice, rote, again, wp){
    let roll = [];
    let roteReRoll = [];
    let tenReRoll = [];

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
        console.log('rote: '+ roteReRoll +' rote tens: '+ roteTen +' rote nines: '+ roteNine +' rote eights: '+ roteEight )
      }

      if(again === 10 && ten){
        let tenCurrent = ten
        let tenNew = 0
        let loopCounter = -1
        let tenReRollRow = []
        while(tenCurrent){
          loopCounter++
          for(let k=0;k<tenCurrent;k++){
            tenReRollRow[k]=Math.ceil(Math.random()*10);
            if(tenReRollRow[k]<=7){
              fails++;
            }else if (tenReRollRow[k]===8){
              successes++;
              eight++;
            }else if(tenReRollRow[k]===9){
              successes++;
              nine++;
            }else{
              successes++;
              ten++;
              tenNew++
            }
            console.log('row at '+ loopCounter + ': '+ tenReRollRow)
          }
          tenReRoll[loopCounter] = tenReRollRow;
          tenReRollRow = [];
          tenCurrent = tenNew;
          tenNew = 0;
        }
        console.log('10-Agains: '+ tenReRoll+ ' Number of 10 again procs: '+ loopCounter+1)
      }
      
      console.log('roll: '+ roll +' successes: '+ successes +' fails: '+ fails +' tens: '+ ten +' nines: '+ nine +' eights: '+ eight)


  }

roll(10, false, 10, false)