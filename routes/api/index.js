const router = require('express').Router();
const rollRoutes = require('./rollRoutes.js');

router.use('/roll', rollRoutes);

module.exports = router;