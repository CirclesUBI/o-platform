# CirclesUbi Working with Linear

- [CirclesUbi Working with Linear](#circlesubi-working-with-linear)
- [Linear.app](#linearapp)
  - [Where is it?](#where-is-it)
- [Teams used in Linear](#teams-used-in-linear)
- [How to Read the Linear 'Issues' View](#how-to-read-the-linear-issues-view)
  - [Issue Statuses for `App` Team](#issue-statuses-for-app-team)
    - [Triage](#triage)
    - [Backlog](#backlog)
    - [To Do](#to-do)
    - [In Progress](#in-progress)
    - [Deployment](#deployment)
    - [Ready for Testing](#ready-for-testing)
    - [Reopened](#reopened)
    - [Done](#done)
    - [Released](#released)
    - [Canceled](#canceled)
- [How to create a Issue for the `App` Team](#how-to-create-a-issue-for-the-app-team)

# Linear.app

## Where is it?

CirclesUbi Linear App Link: https://linear.app/circlesubi

# Teams used in Linear

- The Dev Team for everything frontend/ and backend code related is called `App`
  - At this point in Time the Team consists of Daniel, Thorsten, Jon, and Ingo.
- The Circles Indonesia Business Team is called `Circles Indonesia`
  - At this point in Time this Team consists of Manu
- The Team for the CirclesUbi Dev's Internal Issues is called `Meta`
  - At this point in Time the Team consists of Daniel, Thorsten, Jon, and Ingo.

# How to Read the Linear 'Issues' View

## Issue Statuses for `App` Team

### Triage

This status is automatically assigned by Linear when a Teammember from e.g. Circles Indonesia Adds a new Issue to the `App` Team.

The `App` Team will regulary look at the Issues within the triage status and after making sure it is understood what the ticket is about, move it into the Backlog status where it will be estimated and assigned.

### Backlog

This status contains all Issued from triage that have been verified and accepted by the `App` team.

All issues in this status are either awaiting estimation and a status change to To Do or are in a kind of 'on hold' status, where they should remain in the Backlog until their priority will be high enough to get moved into the To Do status.

### To Do

All Issues that have been properly estimated, and are about to be worked on within the upcoming Week will be in To Do status.

### In Progress

When a Developer starts working on a Issue, he will move it into this status.

### Deployment

When a Developer has commited his Changes for a Issue and the code is on it's way to the `next` branch, this is the status.

### Ready for Testing

When the Code for an Issue has been deployed onto the `next` branch, the issue will be assigned this status.

This Status indicates that the Requester of the Issue can now test/verify the result of the Issue on https://next.circlesubi.id.

At this point the Issue should also be assigned to the person that needs to do the testing/verification of the change.

### Reopened

If the Tester/Verifier of the Issue is not satisfied with the results, they can assign this status and assign it back to the Developer who worked on it.

This way the developer gets notified and knows that there is mor work to be done.

Then the cycle starts over at 'In Progress'.

### Done

If the Tester/Verifier of the Issue is satisfied with the results, he can move it into the Done status.

This shows the Developer that the change was accepted and is ready to be rolled out to production.

### Released

Once the Issue's Changes have been rolled out to production, this is the status that has to be assigned so everyone knows
that it has been released.

It is adviseable to test the issue in question on the production environment at this point to verify again that everything is exactly as it was requested.

### Canceled

This is for any Issues that have been cancelled at any time. Just to keep track.

# How to create a Issue for the `App` Team

1. Create a new Issue for the Team `App` ( keyboard shortcut `c` )
2. Enter a short but descriptive Title
3. Add your Description using the `User Story Methology`
4. Add Attachments of Screenshots or Files if needed
5. Choose A Label 'Bug, Improvement..'
6. IF the Issue has a specific Priority, select a Priority
7. click on `create issue`

**_Please DO NOT select ANY STATUS for this new Issue_**
It will be done by the team who works on it.

This ensures the Team will be able to distinguish new Issues from existing ones and add their Estimation.
