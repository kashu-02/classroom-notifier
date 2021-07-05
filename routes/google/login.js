'use strict'
require('dotenv').config()
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const jwtSECRET_KEY = process.env.SECRET_KEY
const base64url = require('base64url');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const UsersDB = require('../../databases/UsersDB_handler')
const Idlist = require('../../lib/Idlist');
const { token } = require('morgan');

router.post('/', function (req, res, next) {
  (async () => {
    if (!req.body.authCode) {
      res.status(400).json({ "error": "no authCode" })
      return false
    }
    const code = req.body.authCode
    console.log(`code:${code}`)
    const { tokens } = await oauth2Client.getToken(code)
    const user = JSON.parse(base64url.decode(tokens.id_token.split('.')[1]))
    console.log(user)
    const name = user.name
    const email = user.email
    const access_token = tokens.access_token
    const reflesh_token = tokens.refresh_token
    const jwt_token = jwt.sign({
      name: name,
      email: email
    }, jwtSECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '10m'
    })
    await UsersDB.addUser(name, email,access_token,reflesh_token,JSON.stringify(tokens),jwt_token)
    res.json({ "tokens": jwt_token })
    Idlist(tokens)
  })().catch(next);
 });

module.exports = router;
