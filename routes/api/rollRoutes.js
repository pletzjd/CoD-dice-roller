const router = require('express').Router();

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

module.exports = router;