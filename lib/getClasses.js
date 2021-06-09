'use strict'
require('dotenv').config()
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const getClasses = function (tokens) {
  return new Promise((resolve, reject) => {
      try {
        console.log(`tokens:${tokens}`)
        oauth2Client.setCredentials(tokens);
        const classroom = google.classroom({ version: 'v1', auth: oauth2Client});
        classroom.courses.list({
          courseStates: 'ACTIVE',
        }, (err, data) => {
          if (err) {
            console.error('The API returned an error: ' + err);
            let error = new Error('The API returned an error: ' + err)
            error.status = 500 
            reject(error)
          }
          const courses = data.data.courses;
          if (courses && courses.length) {
            console.log('Courses:');
            courses.forEach((course) => {
              console.log(`${course.name} (${course.id})`);
            })
            resolve(courses)
          } else {
            console.log('No Active courses found.')
            let err = new Error('No Active courses found.')
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

module.exports = getClasses