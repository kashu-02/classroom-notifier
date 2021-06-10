'use strict'
const uuid = require('node-uuid')
const UsersDB = require('./UsersDB')

const addUser = function (name, email,access_token,reflesh_token,tokens,jwt_token) {
  return new Promise((resolve,reject) => {
    UsersDB.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      UserId: uuid.v4(),
      name: name,
      email: email,
      access_token: access_token,
      reflesh_token: reflesh_token,
      tokens: tokens,
      jwt_token: jwt_token
    }
  }).then(([user, created]) => {
    if (!created) {
      user.name = name
      user.access_token = access_token
      user.reflesh_token = reflesh_token
      user.tokens = tokens
      user.jwt_token = jwt_token
      user.save()
    }
    resolve()
  }).catch((e) => {
    console.log(e)
    reject(e)
})
  })
}

const Logout = function (jwt_token) {
  return new Promise((resolve, reject) => {
    UsersDB.findOne({
      where: {
        jwt_token: jwt_token
      }
    }).then((user) => {
      user.jwt_token = null
      user.save()
      resolve(user);
    }).catch((e) => {
      console.log(e)
      reject(new Error('eroor'));
  })

  })
}

const getUser = async function (jwt_token) {
  return new Promise((resolve,reject) => {
  UsersDB.findOne({
    where: {
      jwt_token: jwt_token
    }
  }).then((data) => {
    resolve(data)
  }).catch(e => {
    reject(e)
  })
  })
}

const deleteUser = function (tokens) {
  return new Promise((resolve, reject) => {
    UsersDB.destroy({
      where: {
        tokens: tokens
      }
    }).then(() => {
      resolve();
    }).catch((e) => {
      console.log(e)
      reject(new Error('eroor'));
  })

  })
}

module.exports = {
  addUser: addUser,
  Logout: Logout,
  getUser: getUser,
  deleteUser: deleteUser
}
