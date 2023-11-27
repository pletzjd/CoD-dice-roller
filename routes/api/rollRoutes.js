const router = require('express').Router();

const Roll = require('../../models/Roll.js');

//Get all rolls
router.get('/',(req,res) => {
    Roll.findAll({
        order: [['createdAt','DESC']]
    }).then((rollData) => {
        res.json(rollData)
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