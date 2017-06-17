# Kata project to demonstrate proficiency in TDD and OOP using Jest and Javascript (ES6)

## Background
This kata simulates a babysitter working and getting paid for one night. The rules are pretty straight forward.

The babysitter:

* starts no earlier than 5:00PM
* leaves no later than 4:00AM
* gets paid $12/hour from start-time to bedtime
* gets paid $8/hour from bedtime to midnight
* gets paid $16/hour from midnight to end of job
* gets paid for full hours (no fractional hours)

## Assumptions
  I am interpreting "gets paid for full hours (no fractional hours)" in the sense that if the total working time is not in full hours then we will round up to a full hour and apply it at whatever billing rate was active at the time the booking ended.

## Requirements

* node
* yarn

## Setup Process

* Clone this git repo
* run `yarn install` in the root project directory to pull in project dependancies
* run `yarn test` to run the test
* run `yarn build` to build the project
