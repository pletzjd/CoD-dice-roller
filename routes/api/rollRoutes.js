const router = require('express').Router();
const {Op} = require("sequelize")

const Roll = require('../../models/Roll.js');

function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
  
    return str.replace( /(<([^>]+)>)/ig, '');
  }

//Get page limited rolls
router.get('/',(req,res) => {
    if (req.query.page){
        let limit = 25;
        let offset;
        if(isNaN(parseInt(req.query.page))){
            offset = 0;
        }else{
            offset = (parseInt(req.query.page)-1)*limit;
        }
    
        Roll.findAll({
            order: [['rollID','DESC']],
            offset: offset,
            limit: limit
        }).then((rollData) => {
            res.json(rollData)
        })
    }else{
        Roll.findByPk(req.query.roll).then(rollData => res.json(rollData))
    }

})
// Return total number of columns to be used in pagination
router.get('/pages',(req,res) => {
    Roll.count({
        col: 'rollID'
    })
    .then((data) => {
        res.json(data)
    })
})

// Returns a roll based on the date time given
router.get('/date', (req,res) => {
    let date = req.query.date.replace('+','T').concat('.000Z')

    Roll.findAll({
        order: [['rollID', 'DESC']],
        where: {
            createdAt:{
                [Op.eq]: date
            }
        }
    }).then((roll) => {res.json(roll)})
})

//Create new roll
router.post('/', (req, res) => {
    let rollObj = req.body
     Object.keys(rollObj).forEach(key => {
        if(typeof rollObj[key] === 'string'){
            rollObj[key] = removeTags(rollObj[key])
        }
    });

  Roll.create(
    {
        rollType: rollObj.rollType,
        playerName: rollObj.playerName,
        description: rollObj.description,
        dice: rollObj.dice,
        willpower: rollObj.willpower,
        again: rollObj.again,
        rote: rollObj.rote,
        advanced: rollObj.advanced,
        rollOne: rollObj.rollOne,
        rollTwo: rollObj.rollTwo,
        rollOneSuccesses: rollObj.rollOneSuccesses,
        rollTwoSuccesses: rollObj.rollTwoSuccesses
    }).then((newRoll) => {
      res.json(newRoll);
  }).catch((err) => {
      res.json(err);
  });
});

module.exports = router;