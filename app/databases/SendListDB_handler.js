'use strict'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const SendListDB = require('./SendListDB')
const moment = require('moment')

const addSendList = function (UserId,SendEmail,Classname,ClassId) {
  SendListDB.findOrCreate({
    where: {
      [Op.and]: {
        UserId: UserId,
        ClassId: ClassId
      }
    },
    defaults: {
      UserId: UserId,
      SendEmail: SendEmail,
      Classname: Classname,
      ClassId: ClassId,
      LastUpdate: moment()
    }
  }).then(([user, created]) => {
    if (!created) {
      user.SendEmail = SendEmail
      user.Classname = Classname
      user.save()
    }
    return
  }).catch((e) => {
    console.log(e)
    return e
})
}


const getSendList = function (UserId) {
  SendListDB.findAll({
    where: {
      UserId: UserId
    }
  }).then((list) => {
    console.log(JSON.stringify(list))
    return JSON.stringify(list)
  }).catch(e => {
    return e
  })

}

const deleteSendListAll = function (UserId) {
  return new Promise((resolve, reject) => {
    SendListDB.destroy({
      where: {
          UserId: UserId
      }
    }).then(() => {
      resolve()
    }).catch(e => {
      resolve()
    })
  })
}

module.exports = {
  addSendList : addSendList,
  getSendList: getSendList,
  deleteSendListAll: deleteSendListAll
}