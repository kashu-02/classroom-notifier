'use strict'
require('dotenv').config()
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const getAnnouncements = function (courseId, tokens) {
  return new Promise((resolve, reject) => {
    try {
      oauth2Client.setCredentials(JSON.parse(tokens));
      const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
      classroom.courses.announcements.list({
        courseId: courseId,
        pageSize: 10,
        orderBy: 'updateTime desc'
      }, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log(data)
        const announcements = data.data.announcements;
        if (announcements && announcements.length) {
          //console.log(announcements)
          resolve(announcements)
        } else {
          console.log('No announcements found.')
          let err = new Error('No announcements found.')
          reject(err)
        }
      });
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  
}

module.exports = getAnnouncements
