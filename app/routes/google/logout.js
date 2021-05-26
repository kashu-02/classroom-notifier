'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSECRET_KEY = process.env.SECRET_KEY

const UsersDB = require('../../databases/UsersDB_handler')

router.get('/', function (req, res, next) {
  (async () => {
    const jwt_token = req.headers["authorization"].split(" ")[1]
    console.log(`jwt_token:${jwt_token}`)
    if (!jwt_token) {
      res.status(400).json({ "error": "jwt_token error" })
      return false
    }
    
    const Logout = await UsersDB.Logout(jwt_token)
    if (Logout) {
      res.status(200).json({"status": "OK"})
    } else {
      res.status(400).json({ 'error': 'error' })
    }
    

  })().catch(next);
 });

module.exports = router;