'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../lib/isAuthenticated')

const getAnnouncements = require('../../lib/getAnnouncements')

router.get('/', isAuthenticated, function (req, res, next) {
  (async () => {
    const announcements = await getAnnouncements(req.tokens, req.query.courseId)
      res.json(announcements)
  })().catch(next)
})


module.exports = router;