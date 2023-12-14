RETROSPECTIVE 03 (Team 05)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

  | Description       | Committed | Done |
  | ----------------- | --------- | ---- |
  | Number of stories | 8         | 5    |
  | Total points      | 15        | 9    |
  | Nr of hours       | 96        | 96   |

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 14      | -      | 50         |              |
| n9    | 2       | 2      | 5          | 3h45m        |
| n11   | 1       | 1      | 3h30m      | 4h30m        |
| n13   | 4       | 2      | 11h        | 10h15m       |
| n14   | 2       | 2      | 5h15m      | 6h           |
| n15   | 1       | 2      | 5h15m      | 5h15m        |
| n16   | 1       | 1      | 20m        | 15m          |
| n18   | 1       | 2      | 45m        | 1h           |
| n26   | 3       | 3      | 11h        | 10h40m       |
   

- Hours per task (average, standard deviation): 

| Description | Estimated | Actual |
  | ----- | ------- | ------ |
  | Hours per task average |3,2 | 3,13 |
  |Standard Deviation (h) | 1,88 | 2,03 |

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1 = 0,02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 5.75
  - Total hours spent: 5.42
  - Nr of automated unit test cases: 74
  - Coverage (if available): 78.1%
- E2E testing:
  - Total hours estimated: 5.5
  - Total hours spent: 3.5
- Code review 
  - Total hours estimated: 6.5
  - Total hours spent: 6.5
- Technical Debt management:
  - Total hours estimated: 5
  - Total hours spent: 5h11m
  - Hours estimated for remediation by SonarQube: 25h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 5h 
  - Hours spent on remediation: 5h11m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.7%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A A A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
> This time, errors in estimations arised because we couldn't find a day to do the SCRUM meeting all together, so we estimated excessively more than needed for a story even if it was mostly done in the previous sprint. But later, the estimation was corrected and we worked the expected amount of time.

- What lessons did you learn (both positive and negative) in this sprint?
> We organized a little bit better the repository on github.com in order to have at least 1 code review from another team member before merging into the main branch. We were surprised on the benefits since it is a good way to have more precise code reviews and quicker.  
However, we were waiting too much before completing the merges in the main branch and this caused some stories to be not completed because the merge in the main created too many conflicts, even if they were correctly working in the branch in which they were developed.

- Which improvement goals set in the previous retrospective were you able to achieve? 
> In the last retrospective, we identified overestimation as a challenge. I'm proud to share that in the recent sprint, we successfully addressed this issue, ensuring more accurate estimations. Additionally, our team demonstrated improved efficiency, with all members completing their hours as planned. This signifies a positive shift in our approach
  
- Which ones you were not able to achieve? Why?
> We were not able to do the SCRUM planning all together because there was no possibility to do it during the course allocated hours, and so it was difficult to find a day in which all of us could be present. Also, some of us could not participate for last time inconvenients.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> - do not wait the last days to complete the merge
> - merge together and code review more accurately

- One thing you are proud of as a Team!!
> We're proud that everyone on the team worked hard, showing strong commitment. This dedication is a key strength that helps us overcome challenges and succeed together.