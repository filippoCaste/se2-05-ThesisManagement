import { schedule } from "node-cron";
import { archiveExpiredProposals } from "./services/proposal.services.js";

export function initScheduledJobs() {
  // "0 0 * * *" Runs At 00:00.
  // https://crontab.guru/#0_0_*_*_*
  const ProposalExpiration = schedule("0 0 * * *", async () => {
    archiveExpiredProposals();
  });

  // runs all cronjobs at server startup
  archiveExpiredProposals();

  ProposalExpiration.start();
}
