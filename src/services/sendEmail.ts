import nodemailer from "nodemailer";
import Log from "../middlewares/Log";

/**
 * Send Email to the user
 * @param  {string} email
 * @param  {string} subject
 * @param  {string} text
 */
export const sendEmail = async (email: string, subject: string, text: string) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD
        }
      })
  
      if (process.env.NODE_ENV !== 'test') {
        await transporter.sendMail({
          from: 'Example App <no-reply@example.com>',
          to: email,
          subject,
          text
        })
      }
      return true
    } catch (error) {
      Log.error(error)
      return false;
    }
}
  