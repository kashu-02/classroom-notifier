'use strict'
require('dotenv').config()
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const getAnnouncements = function (tokens, courseId) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`tokens:${tokens}`)
      oauth2Client.setCredentials(tokens);
      const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
      classroom.courses.announcements.list({
        courseId: courseId,
      }, (err, data) => {
        if (err) {
          console.error('The API returned an error: ' + err);
          let error = new Error('The API returned an error: ' + err)
          error.status = 500
          reject(error)
        }
        const announcements = data.data.announcements;
        if (announcements && announcements.length) {
          resolve(announcements)
        } else {
          console.log('No announcements found.')
          let err = new Error('No announcements found.')
          err.status = 404
          reject(err)
        }
      });
    } catch (e) {
      console.log(e)
      reject(e)
    }
    });
}

module.exports = getAnnouncements