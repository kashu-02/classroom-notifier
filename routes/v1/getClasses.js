'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../lib/isAuthenticated')

const getClasses = require('../../lib/getClasses')

router.get('/', isAuthenticated, function (req, res, next) {
  (async () => {
    const Classes = await getClasses(req.tokens)
    res.json(Classes)
  })().catch(next)
})

module.exports = router;
