'use strict'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const IdListDB = require('./IdListDB')

const addIdList = function (GoogleUserId,StudentOrTeacher,name) {
  IdListDB.findOrCreate({
    where: {
      GoogleUserId: GoogleUserId
    },
    defaults: {
      GoogleUserId: GoogleUserId,
      StudentOrTeacher: StudentOrTeacher,
      name: name
    }
  }).then(([user, created]) => {
    if (!created) {
      user.name = name
      user.save()
    }
    return
  }).catch((e) => {
    console.log(e)
    return e
})
}


const getIdList = function (GoogleUserId) {
  return new Promise((resolve, reject) => {
    IdListDB.findOne({
      where: {
        GoogleUserId: GoogleUserId
      }
    }).then((list) => {
      resolve(list)
    }).catch(e => {
      reject(e)
    })
  })

}


module.exports = {
  addIdList : addIdList,
  getIdList: getIdList
}