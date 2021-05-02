import sgMail from '@sendgrid/mail'

import { SENDGRID_API_KEY } from '../config/app.config'

sgMail.setApiKey(SENDGRID_API_KEY)

export default sgMail
