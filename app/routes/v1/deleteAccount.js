'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../lib/isAuthenticated')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const SendListDB = require('../../databases/SendListDB_handler')
const UsersDB = require('../../databases/UsersDB_handler')
const SendEmail = require('../../lib/sendEmail')

router.delete('/', isAuthenticated, function (req, res, next) {
  (async () => {
    Promise.all([
      SendListDB.deleteSendListAll(req.UserId),
      UsersDB.deleteUser(JSON.stringify(req.tokens))
    ]).then(async () => {
      const SendEmailAddr = req.email
      const subject = `【Classroom(削除)】`
      const text = `\n Classroom-Notifierから、あなたのユーザー情報を削除しました。\n\n-------------\nこのメールには返信できません。`
      await SendEmail(SendEmailAddr, subject, text)
      res.status(200).json({})
    })
  })().catch(next)
});

module.exports = router;