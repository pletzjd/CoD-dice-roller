function roll(dice, rote, again, wp) {
  let roll = []; //blanc array for main roll

  let successes = 0; //roll success counter
  let fails = 0; //roll fail counter

  let ten = 0; //counts number of 10s rolled for 10-again in main roll
  let nine = 0; //counts number of 9s rolled for 9-again in main roll
  let eight = 0; //counts number of 8s rolled for 8-again in main roll


  //adds 3 dice to dice pool if willpower is being used for roll
  if (wp) {
    dice = dice + 3;
  }

  // Rolls number of 10 sided dice equal to dice pool, keeping track of results for 8, 9 and 10 incase they need to be rerolled
  for (let i = 0; i < dice; i++) {
    roll[i] = Math.ceil(Math.random() * 10);
    if (roll[i] <= 7) {
      fails++;
    } else if (roll[i] === 8) {
      successes++;
      eight++;
    } else if (roll[i] === 9) {
      successes++;
      nine++;
    } else {
      successes++;
      ten++;
    }
  }

  //rerolls all dice with results of 7 or less from main roll if it was a rote action
  if (rote) {
    let roteReRoll = []; //blanc array if to keep track of rote action results
    let roteTen = 0; //counts number of 10s rolled for 10-again in rote roll
    let roteNine = 0; //counts number of 9s rolled for 9-again in rote roll
    let roteEight = 0; //counts number of 8s rolled for 8-again in rote roll
    let originalFails = fails; //stores the original number of fails to be used as a stop point for the for loop while the loop continues to tally the total number of fails
    for (let j = 0; j < originalFails; j++) {
      roteReRoll[j] = Math.ceil(Math.random() * 10);
      if (roll[j] <= 7) {
        fails++;
      } else if (roll[j] === 8) {
        successes++;
        roteEight++;
      } else if (roll[j] === 9) {
        successes++;
        roteNine++;
      } else {
        successes++;
        roteTen++;
      }
    }
    console.log('rote: ' + roteReRoll + ' rote tens: ' + roteTen + ' rote nines: ' + roteNine + ' rote eights: ' + roteEight)
  }

  //rerolls all dice from main roll that were 10 and repeats on its own roll if 10 is rolled until no 10 is rolled if the roll had 10-again
  if (again === 10 && ten) {
    let tenReRoll = []; //blanc array to hold different arrays for each iteration of 10-again rolls
    let tenReRollRow = [] //holds the results of each reroll to be placed in the array of arrays (tenReRoll)
    let tenCurrent = ten //stores original number of tens rolled to be used as a stop point for the for loop
    let tenNew = 0 //initialize a variable to count the number of tens rolled in the reroll
    let loopCounter = -1 //counts the number of times the while loop runs to be used to index the array of arrays that hold the result of each interation of the while loop

    while (tenCurrent) {
      loopCounter++
      for (let k = 0; k < tenCurrent; k++) {
        tenReRollRow[k] = Math.ceil(Math.random() * 10);
        if (tenReRollRow[k] <= 7) {
          fails++;
        } else if (tenReRollRow[k] === 8) {
          successes++;
          eight++;
        } else if (tenReRollRow[k] === 9) {
          successes++;
          nine++;
        } else {
          successes++;
          ten++;
          tenNew++
        }
        console.log('row at ' + loopCounter + ': ' + tenReRollRow)
      }
      tenReRoll[loopCounter] = tenReRollRow;//adds result of the reroll to the array of arrays
      tenReRollRow = []; //resets roll tracker in case of another interation of the while loop
      tenCurrent = tenNew; //sets up next for loop stop point if any 10s were rolled in this reroll. Terminates while loop if no 10s were rolled
      tenNew = 0; //resets counter for number of 10s for next iteration of for loop
    }
    console.log('10-Agains: ' + tenReRoll + ' Number of 10 again procs: ' + (loopCounter + 1))
  }

  console.log('roll: ' + roll + ' successes: ' + successes + ' fails: ' + fails + ' tens: ' + ten + ' nines: ' + nine + ' eights: ' + eight)


}

roll(10, false, 10, false)