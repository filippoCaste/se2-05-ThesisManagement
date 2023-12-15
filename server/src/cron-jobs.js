import { schedule } from "node-cron";
//import { archiveExpiredProposals } from "./services/proposal.services.js";
import { scheduleEmailsOneWeekBeforeExpiration } from "./emailService/planEmail.js";
import { archiveExpiredProposals } from "./services/proposal.services.js";

export function initScheduledJobs() {
  // "0 0 * * *" Runs At 00:00.
  // https://crontab.guru/#0_0_*_*_*


  const ProposalExpiration = schedule("0 0 * * *", async () => {
    archiveExpiredProposals();
    const emailsAlreadySent = scheduleEmailsOneWeekBeforeExpiration(emailsAlreadySent);
  });
 
  // runs all cronjobs at server startup
  archiveExpiredProposals();
  scheduleEmailsOneWeekBeforeExpiration();

  ProposalExpiration.start();
}