const express = require('express')
const router = express.Router()

router.use('/getclasses', require('./getClasses'))
router.use('/getteachers', require('./getTeachers'))
router.use('/getannouncements', require('./getAnnouncements'))
router.use('/sendlist', require('./SendList'))
router.use('/deleteaccount', require('./deleteAccount'))

module.exports = router