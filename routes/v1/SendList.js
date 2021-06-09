'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../lib/isAuthenticated')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const SendListDB = require('../../databases/SendListDB_handler')
const SendEmail = require('../../lib/sendEmail')

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

router.get('/', isAuthenticated, async function (req, res, next) {
  const SendListDB = require('../../databases/SendListDB')
  SendListDB.findAll({
      where: {
        UserId: req.UserId
      }
    }).then((list) => {
      res.json(list)
    }).catch(e => {
      next(e)
    })
});
 

router.post('/', isAuthenticated, function (req, res, next) {
  (async () => {
    const UserId = req.UserId
    const SendEmailAddr = req.email
    const ClassId = req.body.ClassId
    let Classname
    oauth2Client.setCredentials(req.tokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client});
    classroom.courses.get({
      id: ClassId,
    }, async (err, data) => {
      if (err) {
        console.error('The API returned an error: ' + err);
        let error = new Error('The API returned an error: ' + err)
        error.status = 500 
        return next(error) 
      }
      const details = data.data;
      console.log("begin google")
      console.log(data.data)
      console.log("end google")
      console.log(`details.length:${details.length}`)
  
      if (details && Object.keys(details).length) {
        Classname = details.name
        SendListDB.addSendList(UserId, SendEmailAddr, Classname, ClassId)
        const subject = `【Classroom(新規登録)】${Classname}`
        const text = `\n Classroom-Notifierに${Classname}を登録しました。\n\n-------------\nこのメールには返信できません。`
        await SendEmail(SendEmailAddr,subject,text)
        res.status(200).json({})
      } else {
        console.log('No courses found.')
        let err = new Error('No courses found.')
        err.status = 404 
        return next(err) 
      }
      
    });

  })().catch(next);
});

router.delete('/', isAuthenticated, async function (req, res, next) {
  try {
    const SendListDB = require('../../databases/SendListDB')
    const SendEmailAddr = req.email
    const UserId = req.UserId
    const ClassId = req.query.ClassId
    SendListDB.destroy({
      where: {
        [Op.and]: {
          UserId: UserId,
          ClassId: ClassId
        }
      }
    }).then(async () => {
      const subject = `【Classroom(削除)】`
      const text = `\n Classroom-Notifierから、ClassId:${ClassId}を削除しました。\n\n-------------\nこのメールには返信できません。`
      await SendEmail(SendEmailAddr,subject,text)
      res.status(200).json({})
    }).catch(e => {
      console.log(e)
      return next(e)
    })
    
  } catch (e) {
    console.log(e)
    return next(e)
  }

});

module.exports = router;
