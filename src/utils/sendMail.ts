import nodemailer from 'nodemailer'

import { Settings } from '../models/entities/Settings'
import { EmailSystemSettings } from '../models/jsonTypes/EmailSystemSettings'

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (
  to: string[],
  subject: string,
  html: string,
  ccName?: string,
  ccEmail?: string
): Promise<void> => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  })

  let fromName = 'Linkby Support'
  let fromEmail = process.env.MAIL_USERNAME as string

  const settingsData = await Settings.findOne({ where: { key: 'email' } })

  if (settingsData && ((settingsData.value as unknown) as EmailSystemSettings).fromName) {
    fromName = ((settingsData.value as unknown) as EmailSystemSettings).fromName
  }

  if (settingsData && ((settingsData.value as unknown) as EmailSystemSettings).fromEmail) {
    fromEmail = ((settingsData.value as unknown) as EmailSystemSettings).fromEmail
  }

  if (ccName && ccEmail) {
    // send mail with defined transport object
    await transporter.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      }, // sender address
      to, // list of receivers
      sender: {
        name: fromName,
        address: fromEmail,
      }, // senders
      cc: {
        address: ccEmail,
        name: ccName,
      },
      subject, // Subject line
      html, // html body
    })
  } else {
    await transporter.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      }, // sender address
      to, // list of receivers
      sender: {
        name: fromName,
        address: fromEmail,
      }, // senders
      subject, // Subject line
      html, // html body
    })
  }
}
