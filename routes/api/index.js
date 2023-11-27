const router = require('express').Router();
const rollRoutes = require('./rollRoutes');

router.use('/roll', rollRoutes);

module.exports = router;