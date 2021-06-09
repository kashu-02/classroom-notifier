'use strict'

const { send } = require('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const moment = require('moment')

const IdlistDB = require('../databases/IdListDB_handler')

const API_KEY = process.env.SENDGRID_APIKEY
sgMail.setApiKey(API_KEY);

const sendEmail = async function (to, Classname, announcement) {
  const Idlist = await IdlistDB.getIdList(announcement.creatorUserId)
  const name = Idlist.name
  let attachment = "";
  if (announcement.materials) {
    attachment += "\n\n-------------------------\n【添付ファイル】\n"
    announcement.materials.forEach(material => {
      console.log(material)
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
  let subject
  let text
  if (moment(announcement.updateTime).isBetween(moment(announcement.creationTime),moment(announcement.creationTime).add(1,'minutes'))) {
    subject = `【Classroom(新規投稿)】${Classname}`
    text = `${Classname}\n${moment(announcement.updateTime).add(9,'hours').format("YYYY年MM月DD日　hh時mm分ss秒　投稿")}\n${name || '不明なユーザー'}\n\n${announcement.text}\n\n${attachment}\n\n-------------------------\n※このメールには返信できません。\nこの配信を解除するには「https://classroom-notifier.netlify.app」にアクセスしてください。`
  } else {
    subject = `【Classroom(編集済み)】${Classname}`
    text = `${Classname}\n${moment(announcement.updateTime).add(9,'hours').format("YYYY年MM月DD日　hh時mm分ss秒　編集")}\n${name || '不明なユーザー'}\n\n${announcement.text}\n\n${attachment}\n\n-------------------------\n※このメールには返信できません。\nこの配信を解除するには「https://classroom-notifier.netlify.app」にアクセスしてください。`
  }
  
  const msg = {
    to: to,
    from: {
        email: process.env.fromemail,
        name: 'Classroom-Notifier'
    },
    reply_to: process.env.reply_to,
    subject: subject,
    text: text,
      
  }

  sgMail.send(msg).then(res => {
      console.log(res);
  }).catch(e => {
      console.log(e);
  });

}

module.exports = sendEmail