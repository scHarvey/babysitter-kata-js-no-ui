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

describe('RateCalculator Calculations', () => {
  it('returns 24 for a 2 hour booking before bedtime', () => {
    startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime);

    expect(calcReturn.rate).toEqual(24);
  });

});
