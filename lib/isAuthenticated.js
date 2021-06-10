'use strict'
require('dotenv').config()

const jwt = require('jsonwebtoken');
const jwtSECRET_KEY = process.env.SECRET_KEY

const UsersDB = require('../databases/UsersDB_handler')


const isAuthenticated = async function (req,res,next) {
  try {
    console.log(req.headers)
    if (!req.headers['authorization']) {
      let err = new Error("jwt token are required.")
      err.status = 400
      return next(err)
    }
    const bearToken = req.headers['authorization']
    const bearer = bearToken.split(' ')
    const token = bearer[1]

    const user = jwt.verify(token, jwtSECRET_KEY)
    console.log(`jwt_user: ${user}`)
    const DBuser = await UsersDB.getUser(token)
    if (!(DBuser.name == user.name && DBuser.email == user.email)) {
      let err = new Error("jwt and DB don't match")
      err.status = 403
      return next(err)
    }
    req.email = user.email
    req.name = user.name
    req.UserId = DBuser.UserId
    req.tokens = JSON.parse(DBuser.tokens)
    next()

  } catch (e) {
    console.log(e)
    return next(e)
  }
}

module.exports = isAuthenticated