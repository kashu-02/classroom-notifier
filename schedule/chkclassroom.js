'use strict'

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require("moment");
const SendListDB = require('../databases/SendListDB')
const UsersDB = require('../databases/UsersDB')
const getAnnouncements = require('./getAnnouncements')
const sendEmail = require('./sendEmail')

const chkclassroom = function () {
  console.log("chkclassroom")
  SendListDB.findAll({
    include: [
      { model: UsersDB }
    ]
  }).then((list) => {
    list.forEach(async (element) => {
      let nowdate = moment().utc()
      let announcements = await getAnnouncements(element.ClassId, element.User.tokens)
      console.log(announcements)
      announcements.forEach((announcement) => {
        if (moment(announcement.updateTime).isAfter(moment(element.LastUpdate))) {
          sendEmail(element.SendEmail, element.Classname, announcement)
        }
      })
      SendListDB.update({
        LastUpdate: nowdate
      }, {
        where: {
          Id: element.Id
        }
      })
      return
    });
    
    
  }).catch((e) => {
    console.log(e)
    return e
  })

}

module.exports = chkclassroom