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
    const maxID = Roll.findOne({
        attributes: ['rollID'],
        order: [['rollID', 'DESC']],
    })

    const minID = Roll.findOne({
        attributes: ['rollID'],
        order: ['rollID'],
    })

    Promise.all([maxID, minID]).then((values) => {
        res.json(values)
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