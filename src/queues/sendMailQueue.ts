import Queue from 'bull'

const sendMailQueue = new Queue('sendMail', process.env.REDIS_ENDPOINT as string, {
  redis: {
    password: process.env.REDIS_PASSWORD,
  },
})

export default sendMailQueue
