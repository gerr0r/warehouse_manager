const router = require('express').Router()
const calc = require('../controllers/calc')

router.get('/add', calc.add)
router.get('/subtract', calc.subtract)
router.get('/multiply', calc.multiply)

module.exports = router