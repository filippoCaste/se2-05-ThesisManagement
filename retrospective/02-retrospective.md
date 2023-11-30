# RETROSPECTIVE #2 (Team 05)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

<!-- - Number of stories committed vs. done
- Total points committed vs. done
- Nr of hours planned vs. spent (as a team) -->
  | Description | Committed | Done |
  | ----- | ------- | ------ |
  | Number of stories | 6 | 6 |
  | Total points | 8 | 8 |
  | Nr of hours | 90.25  |  86.58 |

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

<!-- > Please refine your DoD if required (you cannot remove items!) -->

<!--
Mainly the definition of DONE referred to passing the implemented unit tests as well as.
On "Call the next user" and "See the next number" we instead focused on code review by 2 members of the team per story -->

### Detailed statistics

| Story                  | # Tasks | Points | Hours est. | Hours actual |
| ---------------------- | ------- | ------ | ---------- | ------------ |
| #0                     | 23   |        |    37h15m   |    37h45m   |
| Accept application |  3   |   2   |    4   |   4    |
| Browse application decisions | 1     | 9   |   4h40m  |   
| Browse proposals |  1    |   1   |   1   |   1h20m    |
| Update proposal  |  3    |   2  |    12   |   14     |
| Delete proposal  |  3  |  1 |  7  |  7h15m  |
| Archive proposal |  3  | 1 |  10  |  8   |

<!-- > place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case) -->

- Hours per task average, standard deviation (estimate and actual)
  | Description | Estimated | Actual |
  | ----- | ------- | ------ |
  | Hours per task average |2.38 | 2.28 |
  |Standard Deviation (h) | 1.59 | 1.57 |

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1 = 0.04

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 7.5
  - Total hours spent: 7.5 
  - Nr of automated unit test cases: 54
  - Coverage (if available): 66.4 %
- E2E testing:
  - Total hours estimated: 5
  - Total hours spent: 5
- Code review
  - Total hours estimated: 5
  - Total hours spent: 4.25

## ASSESSMENT

- What caused your errors in estimation (if any)?
> We decreased our error ratio, this means that in the trial sprint we had acquired more experience about estimation. Some errors are due to underestimation of the initialization of the repository, the setup of the web application and all the database by creating the structure and populate it with data.  
> Some few differences between the estimation and the real situation come also from the fixes we needed to do in order to accomplish the clarifications in the FAQ.
- What lessons did you learn (both positive and negative) in this sprint?
> Communication is the most important part of the process. Organization should be prioritized.  
> Creating a structured timeline that outlines tasks for team members to follow should be established before initiating any work. Prior to implementation, the team should reach a consensus on the API design.

- Which improvement goals set in the previous retrospective were you able to achieve?
>More scrum: they went as planned and it made clear an overview of the current workflow direction  
>Know what others do: it is better to define what the others do to not duplicate apis/tests or, more in general, part of the code.
- Which ones you were not able to achieve? Why?
> We organized better with the scrum meetings, but indeed it was not enough. We should try to organize real-life (i.e. not videocall) meetings and work coordinated.
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

>1. Define everything before start, roles and the database architecture in the SCRUM planning phase.
>2. Some days before the demo, we have to do the merges, so that we have time to resolve all the conflicts that could appear.
>3. Team building to improve organization performance as well as team coordination.   
>4. Better communication among those working on their same assigned story. Making clear the timeline of each one could effectively make the difference to avoid any overlap of work by daily notification of the planned workflow.


- One thing you are proud of as a Team!!  
***All of us did his/her best, this is a good point!***  

>We are proud to have achieved some of the previous objectives, and we know we will be greater scrum by scrum!
