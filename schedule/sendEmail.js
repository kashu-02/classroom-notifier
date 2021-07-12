'use strict'

const { send } = require('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone')

const IdlistDB = require('../databases/IdListDB_handler')

const API_KEY = process.env.SENDGRID_APIKEY
sgMail.setApiKey(API_KEY);

const sendEmail = async function (to, Classname, announcement) {
  let name
  try {
    const Idlist = await IdlistDB.getIdList(announcement.creatorUserId)
    name = Idlist.name
  } catch {
    name = '不明なユーザー'
  }
  let attachment = ""
  if (announcement.materials) {
    attachment += "\n\n-------------------------\n【添付ファイル】\n"
    announcement.materials.forEach(material => {
      //console.log(material)
      if (material.driveFile) {
        attachment += `「${material.driveFile.driveFile.title}」：\n${material.driveFile.driveFile.alternateLink}\n`
      }
      if (material.youtubeVideo) {
        attachment += `「${material.youtubeVideo.title}」：\n${material.youtubeVideo.alternateLink}\n`
      }
      if (material.link) {
        attachment += `「${material.link.title}」：\n${material.link.url}\n`
      }
      if (material.form) {
        attachment += `「${material.form.title}」：\n${material.form.formUrl}\n`
      }
    });
  }

  let subject = `【Classroom(投稿)】${Classname} (PostId:${announcement.id})`
  let text = `${Classname}\n${moment(announcement.updateTime).tz("Asia/Tokyo").format("YYYY年MM月DD日　hh時mm分ss秒　投稿")}\n${name || '不明なユーザー'}\n\n${announcement.text}\n\n${attachment}\n\n-------------------------\n※このメールには返信できません。\nこの配信を解除するには「https://classroom-notifier.netlify.app」にアクセスしてください。`
  
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
      //console.log(res);
  }).catch(e => {
      console.log(e);
  });

}

module.exports = sendEmail
