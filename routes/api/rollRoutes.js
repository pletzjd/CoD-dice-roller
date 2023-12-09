const router = require('express').Router();
const {Op} = require("sequelize")

const Roll = require('../../models/Roll.js');

//Get page limited rolls
router.get('/',(req,res) => {
    let limit = parseInt(req.query.limit)
    let offset = parseInt(req.query.page-1)*limit;



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
  Roll.create(req.body).then((newRoll) => {
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