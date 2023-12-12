import { sendEmail } from './sendEmail.js';
import cron from 'node-cron';



// Function to schedule email one week before expiration date
export const scheduleEmailOneWeekBefore = (expirationDate,receiver,title) => {
  // Convert expiration date string to a JavaScript Date object
    const expiration = new Date(expirationDate);
    const subject = `TM - Proposal ${title} will expires ${expirationDate}`;
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Proposal Expiration Notification</title>
            </head>
            <body>
                <h1>Proposal Expiration Notification</h1>
                <p>Hello there,</p>
                <p>This is a notification that Proposal ${title} is set to expire on ${expirationDate}. Please take necessary actions.</p>
                <p>Thank you.</p>
            </body>
            </html>`;


  // Calculate the date one week before expiration
  const oneWeekBefore = new Date(expiration.getTime() - 7 * 24 * 60 * 60 * 1000);
  /*
  Minute (0-59)
  Hour (0-23)
  Day of the month (1-31)
  Month (1-12 or names like JAN, FEB, etc.)
  Day of the week (0-7 or names like SUN, MON, etc., where 0 and 7 both represent Sunday) */

  // Schedule email using node-cron
  cron.schedule(`43 15  ${oneWeekBefore.getDay()}`, () => {
    sendEmail(receiver, subject, htmlContent);
  });
}