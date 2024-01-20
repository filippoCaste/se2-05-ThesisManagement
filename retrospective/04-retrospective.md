TEMPLATE FOR RETROSPECTIVE (Team 05)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

| Description       | Committed | Done   |
| ----------------- | --------- | ------ |
| Number of stories | 11 (*)    | 11 (*) |
| Total points      | 22 (**)   | 22(**) |
| Nr of hours       | 96        | 97h39m |

(*) --> 3 from previous sprint  
(**) --> 6 from previous sprint

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- **SonarCloud quality gate passed**
- **Approval from other team members**


### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 13      | -      | 53.75      | 48.04        |
| n9    | 1       | 2      | 0.67       | 0.67         |
| n14   | 1       | 2      | 0.67       | 0.67         |
| n18   | 1       | 2      | 0.67       | 0.67         |
| n19   | 3       | 2      |   4.25     |     8.25     |
| n20   | 2       | 1      |    2.67    |      1    |
| n27   | 3       | 3      |   9.67     |     8.5     |
| n28   | 3       | 2      |   4.5     |     8     |
| n30   | 3       | 2      |   5.75     |    5.58      |
| n29   | 2       | 2      |    2.67    |    1.28      |
| n17   | 1       | 1      |    0.17    |     0.83     |
| nX*   | 4       | 2      |    10.42    |    14.17      |

> \* from FAQ document

   
- Hours per task (average, standard deviation): 

| Description            | Estimated | Actual |
| ---------------------- | --------- | ------ |
| Hours per task average | 2.6       | 2.65   |
| Standard Deviation (h) | 2.85      | 2.62   |


- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1 = 0.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 8h03m
  - Nr of automated unit test cases: 124 unit tests
  - Coverage: 85.2%
- E2E testing:
  - Total hours estimated: 9h
  - Total hours spent: 2h7m
- Code review 
  - Total hours estimated: 11h
  - Total hours spent: 11h
- Technical Debt management:
  - Total hours estimated: 10h 
  - Total hours spent: 9h40m
  - Hours estimated for remediation by SonarCloud: 20h
  - Hours estimated for remediation by SonarCloud only for the selected and planned issues: 16h
  - Hours spent on remediation: 9h40m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2 %
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
    - reliability: A
    - security: A
    - maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
> We underestimated some tasks and overestimated others, so there are some tasks where we worked double than expected, but in the end these errors balanced out and we ended up working the supposed hours

- Which improvement goals set in the previous retrospective were you able to achieve? 
> Merge together and code review more accurately, we hope in our work life we will have the chance to be better!
  
- Which ones you were not able to achieve? Why?
> While we successfully opened and merged numerous pull requests earlier in the process, some were left until the final days. This posed a challenge as it limited the time available to troubleshoot any arising issues. Improved planning and distribution of tasks could help avoid this bottleneck in the future.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
> Unfortunately, there won't be more sprints.

- One thing you are proud of as a Team!!
> Our team is proud to have successfully completed a challenging project, demonstrating our collective capability and commitment and showing that we’re ready to work on real life projects professionally
