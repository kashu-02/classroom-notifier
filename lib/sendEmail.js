'use strict'

const { send } = require('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');


const API_KEY = process.env.SENDGRID_APIKEY
sgMail.setApiKey(API_KEY);

const sendEmail = function (to, subject, text) {
  return new Promise((resolve, reject) => {
    const msg = {
      to: to,
      from: {
        email: process.env.fromemail,
        name: 'Classroom Notifier'
      },
      reply_to: process.env.reply_to,
      subject: subject,
      text: text,
        
    }
  
    sgMail.send(msg).then(res => {
      console.log(res);
      resolve(res)
    }).catch(e => {
      console.log(e);
      reject(e)
    });
  })
}

module.exports = sendEmail
