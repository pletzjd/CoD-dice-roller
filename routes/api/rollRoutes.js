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
})

router.get('/pages',(req,res) => {
    Roll.count({
        col: 'rollID'
    })
    .then((data) => {
        res.json(data)
    })
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

//Delete rolls older than 6 months
router.delete('/deleteOld', (req, res) => {
    let currentDate = new Date;
    let sixMonthsAgo;
    if(currentDate.getMonth() <= 5){
        sixMonthsAgo = new Date(currentDate.getFullYear() - 1, 6 + currentDate.getMonth(), currentDate.getDate())
    }else{
        sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate())
    }

    Roll.destroy({
        where: {
            createdAt: {
                [Op.lte]: sixMonthsAgo
            }
        }
    })
    .then((data) => {
        console.log(data)
        res.json('Old entries deleted')
    })  
})

module.exports = router;