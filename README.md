# Collaborative Annotations Web-App aka CAW-App!

Is a simple Web-App which allows users to place annotations in all areas of the screen. When an annotation is placed, a marker is shown in the clicked position as well a textbox, which the user can enter whatever text they like. 

## Getting started

- Run `yarn` to install dependencies
- To develop locally, run `yarn start`
- To run tests, run `yarn test`

## Technical overview

Within CAW-App, you'll find there's two components responsible for the displaying (i.e. `<MarkerEditableTooltip />`) and managing the state (i.e. `<MarkerEditableTooltipContainer />`) for **all** of the annotations. I felt that this was a good separation of concerns as these components can be focused on their respective roles. The tooltip is "dumb" and focus on the visual side and the container
can contain the necessary logic to sync, store and update tooltips and notify the backend of these changes.

## Improvements/discussion

- concurrent usage of the Web-App

  - the last received update wins, this is the simplest solution however it results in a loss of data which is not ideal. This is what is currently implemented.
  - introduce a form of conflict resolution, which is a more complicated solution. It would rely on some additional UI to show changes and give the option to reject, accept or merge them?
  - or some form of concurrent edits, something like how confluence shows a separate cursor and text typed by another person. There's a fair bit of complexity here.
  - requires some form of userId or sessionId to help identify where the edits are coming from
    - there needs to be a mechanism to retrieve edits in near real-time for clients that are working on the same tooltip. The backend DB needs to be aware of the relationship between users and the message being edits and have a socket to update the UI. The content within a tooltip should be revised so it's an audited list.
    - the UI has to the capability to play this audit list back and have some form of conflict resolution? However if the user can see the other cursor, they should be able to avoid each other's edits.

- monorepo, as this Web-App and Web-Api are tightly coupled, it would be easier to manage if it were in one repo. Benefits:

  - easily allow cross cutting features in both projects, using git's branching strategy
  - deploying feature branches for each project, requires extra synchronization and some form of contract and versioning
  - share types in both projects, which will reduce the mapping concerns

- end 2 end coverage

  - it would be good to add E2E test coverage in this repo, to cover the happy path behaviour with the backend running. This would be help greatly by having a monorepo and some scripts to start both projects up and then start the tests

- error handling
  - currently there is no error handling. It would nice to show the user if there's connection issue, version inconsistencies with the backend or possibly something totally unexpected (with the capability to notify us). Can consider using error boundary here as a robust of achieving this.
- busy state handling
  - animation to show the user that something is happening, like on first load
- stacking of tooltips
  - currently
- smart tooltip placement around boundaries

- app state management (like redux)
  - as this project scales, it might be necessary to introduce a form of state management. This has some nice synergy with the audit approach mentioned previously
- Web-App/Web-Api versioning
  - synchronization of breaking changes
  - UI needs to a gracefully to let the user know that he/she needs to refresh the page
