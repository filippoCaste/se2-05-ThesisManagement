import { sendEmail } from './sendEmail.js';
import { getEmailsSupervisorsOneWeekExpiration } from '../services/proposal.services.js';
import dayjs from 'dayjs';

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
    sendEmail(receiver, subject, htmlContent);
}

export const scheduleEmailsOneWeekBeforeExpiration = async (objcAlreadySent) => {
  const objects = await getEmailsSupervisorsOneWeekExpiration();
  const filteredObjects = Array.isArray(objcAlreadySent) && objcAlreadySent.length > 0 ?
  objects.filter((obj) => {
    return !objcAlreadySent.some((sentObj) =>
      sentObj.email === obj.email &&
      sentObj.title === obj.title &&
      sentObj.expiration_date === obj.expiration_date
    );
    // Filter objects that do not have an identical email, title, and expiration_date present in objcAlreadySent
  }) :
  objects;
  for (const tuple of filteredObjects) {
    const { expiration_date, email, title } = tuple;
    scheduleEmailOneWeekBefore(expiration_date, email, title);
  }

  // Remove objects that are expired
  const notExpiredObjects = filteredObjects.filter((obj) => {
    return dayjs(obj.expiration_date).isAfter(dayjs());
  });

  return notExpiredObjects;
};


