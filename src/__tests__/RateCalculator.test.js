'use strict';

import Moment from 'moment';
import RateCalculator from '../RateCalculator';

const rateCalculator = RateCalculator();
let calcReturn = null;
let startTime = null;
let endTime = null;
let bedTime = null;

/*
* gets paid $12/hour from start-time to bedtime
* gets paid $8/hour from bedtime to midnight
* gets paid $16/hour from midnight to end of job
* gets paid for full hours (no fractional hours)
*/

beforeEach(() => {
  // reset testing vars
  calcReturn = null;
  startTime = null;
  endTime = null;
  bedTime = null;
});

describe('RateCalculator Calculations whole hours', () => {
  it('returns 24 for a 2 hour booking before bedtime', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(24);
  });

  it('returns 32 for a 3 hour booking with 1 hour after bedtime but before midnight', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(20).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(32);
  });

  it('returns 48 for a 4 hour booking with 1 hour after bedtime and 1 hour after midnight', () => {
    startTime = new Moment().startOf('day').hour(21).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(25).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(23).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(48);
  });

  it('returns 24 for a 3 hour booking all before midnight and all after bedTime.', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(20).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(24);
  });

  it('returns 48 for a 3 hour booking all after midnight and after bedTime.', () => {
    startTime = new Moment().startOf('day').hour(24).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(27).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(22).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(48);
  });
});

describe('RateCalculator Calculations partial hours', () => {
  it('returns 36 for a 2.5 hour booking before bedtime', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(30).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(30).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(36);
  });

  it('returns 44 for a 3.5 hour booking with 1 of those after bedtime but before midnight.', () =>{
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(20).minute(30).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(30).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime, '*');

    expect(calcReturn.totalCost).toEqual(44);
  });

  it('returns 40 for a 3.5 hour booking with 1.5 of those after bedtime but before midnight.', () =>{
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(20).minute(30).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime, '*');

    expect(calcReturn.totalCost).toEqual(40);
  });

  it('returns 52 for a 3.5 hour booking with 1 of those after bedtime and 1.5 after midnight.', () =>{
    startTime = new Moment().startOf('day').hour(22).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(25).minute(30).format('X');
    bedTime = new Moment().startOf('day').hour(23).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);
    console.log(calcReturn);
    expect(calcReturn.totalCost).toEqual(52);
  });

  it('returns 36 for a 2.2 hour booking before bedtime', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(12).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(12).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.totalCost).toEqual(36);
  });
});
