import { MailDataRequired } from '@sendgrid/mail'
import { Service } from 'typedi'

import { appConfig } from '../config'
import { sgMail } from '../utilities'

@Service()
export class EmailService {
  /**
   * Send an email
   * @param {{ email: string; name: [string] }} to
   * @param {string} subject
   * @param {string} html
   * @param {string} text
   * @returns {Promise}
   */
  async sendEmail(
    to: { email: string; name?: string },
    subject: string,
    html: string,
    text: string
  ): Promise<void> {
    const msg: MailDataRequired = {
      from: {
        email: appConfig.FROM_EMAIL,
        name: appConfig.FROM_EMAIL_NAME,
      },
      to,
      subject,
      html,
      text,
    }
    await sgMail.send(msg, false)
  }

  /**
   * Send reset password email
   * @param {{ email: string; name: [string] }} to
   * @param {string} token
   * @returns {Promise}
   */
  async sendResetPasswordEmail(to: { email: string; name?: string }, token: string): Promise<void> {
    const subject = 'Reset password'
    const resetPasswordUrl = `${appConfig.FRONTEND_APP_URL}/auth/reset_password?token=${token}`
    const text = `Dear user,
                  To reset your password, click on this link: ${resetPasswordUrl}
                  If you did not request any password resets, then ignore this email.`
    const html = text

    await this.sendEmail(to, subject, html, text)
  }

  /**
   * Send verification email
   * @param {{ email: string; name: [string] }} to
   * @param {string} token
   * @returns {Promise}
   */
  async sendVerificationEmail(to: { email: string; name?: string }, token: string): Promise<void> {
    const subject = 'Email Verification'
    const verificationEmailUrl = `${appConfig.FRONTEND_APP_URL}/auth/email_verification?token=${token}`
    const text = `Dear user,
                  To verify your email, click on this link: ${verificationEmailUrl}
                  If you did not create an account, then ignore this email.`
    const html = text
    await this.sendEmail(to, subject, html, text)
  }
}
