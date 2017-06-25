var router = require('express').Router()
var controller = require('./route')


router.post('./register',controller.register)


module.exports = router