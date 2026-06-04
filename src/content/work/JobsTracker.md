---
title: J.O.B.S. Tracker
description: A small webapp for building maintence, turned Google Sheet.
img: 
tags:
  - - React
    - NextJS
    - PrismaORM
    - Google Sheets
    - Adaptablilty
url: 
logo: 
---

---

## Background

This was an ever changing project. This was for a charity for building maintence. However, initially, a small React web app was tested, but after some internal process changes, the charity ended on a Google Sheet to manage this 
process.


---

## Onboarding & Early Ideas

The brief consistented of a few key points: 
 - 'Out current system is paper cards'
 - 'Lots of jobs are being missed'
 - 'We need a fool proof system to help us keep up with it'.

So I suggested a small web app. It would have:
- Basic email and password authentication and Google auth using [Better auth](https://better-auth.com)
- A small Prisma datebase behind it to handle both one off tasks and the recurring tasks
- Different user accounts for admin and users, with dynamic rendering for each 

That way, tasks can't fall through the cracks as all due tasks appear in the dashboard of the admin, and they can assign them to the users to do, with information on how to complete the task allowing with the job.

### Prototype of the React app

![Picture of the prototype's login page.](/images/work/jobstracker/jobstracker.png)

This prototype was created by me doing the Prisma database and basic outline, then styled and formatted by [Antigravity](https://antigravity.google) AI to speed up the prototyping stage.

The client was very happy with the result. However, a change in the internal process change the brief slightly. Instead they were only to have a few people handle the admin side, with no user interaction. This meant that they would hand out the jobs manualy.

After some thought and discussion with the client, we ended on a Google Sheet. This was deemed by both of us as the simplest method for their new circumstances and so I began the build.

---

## The Build

To keep the same basic structure, I recreated the basic Prisma architecture in the sheet, reflecting the table column names in the spreadsheet column names. This kept the same versatility and familiarity for the client.

For the JavaScript logic, I used some formulas for basic functions, but for more complicated robust logic as was in the React version, I used [AppScripts](https://workspace.google.com/products/apps-script/). Finally, for a similar visual cues, I used conditional formating to highlight key information at a glance, like due tasks, overdue, and who they were assigned to.

---

## Outcome & Key takeaways

### Outcome

The final site gave them exactly what they needed:

- A simple way to manage their maintenance tasks
- Solutions not overkill for their situation
- A robust method that is hard to break

Despite the mid development changes, it was an overall smooth project, resulting in a product both the client and I were happy with.

### Key takeaways

Despite the React web app not being used, it provided invaluable skills in live databases in the backend, and the most effective way to show it in the frontend. But the mid change further improved my adapablity skills, as I had to change mid project to suit new objectives, and critera.

---
