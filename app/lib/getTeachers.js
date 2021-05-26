'use strict'
require('dotenv').config()
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const getTeacher = function (tokens,courseId) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`tokens:${tokens}`)
      oauth2Client.setCredentials(tokens);
      const classroom = google.classroom({ version: 'v1', auth: oauth2Client});
      classroom.courses.teachers.list({
        courseId: courseId,
      }, (err, data) => {
        if (err) {
          console.error('The API returned an error: ' + err);
          let error = new Error('The API returned an error: ' + err)
          error.status = 500 
          reject(error)
        }
          const teachers = data.data.teachers;
        if (teachers && teachers.length) {
          resolve(teachers)
        } else {
          console.log('No teachers found.')
          let err = new Error('No teachers found.')
          err.status = 404 
          reject(err)
        }
      });
      } catch (e) {
        console.log(e)
        reject(e)
      }
  }); 
  
 };

module.exports = getTeacher;