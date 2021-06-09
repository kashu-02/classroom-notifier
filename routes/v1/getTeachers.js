'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../lib/isAuthenticated')

const getTeacher = require('../../lib/getTeachers')

router.get('/', isAuthenticated, function (req, res, next) {
  (async () => {
    const Teacher = await getTeacher(req.tokens, req.query.courseId)
    res.json(Teacher)
  })().catch(next)
})


module.exports = router;