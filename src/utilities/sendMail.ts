import sgMail from '@sendgrid/mail'
import { appConfig } from '../config'

sgMail.setApiKey(appConfig.SENDGRID_API_KEY)

export default sgMail
