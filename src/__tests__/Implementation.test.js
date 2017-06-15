'use strict';

import Moment from 'moment';
import BabySitterBooking from '../BabySitterBooking';

const babySitterBooking = BabySitterBooking();
let bookingReturn = null;
let startTime = null;
let endTime = null;
let bedTime = null;

beforeEach(() => {
  // reset testing vars
  bookingReturn = null;
  startTime = null;
  endTime = null;
  bedTime = null;
});

describe('BabysitterBooking Calculations ', () => {

  it('properly calculates the cost when given a valid booking', () => {
    startTime = new Moment().startOf('day').hour(17).minute(30).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime, endTime, bedTime);

    expect(bookingReturn.costs.totalCost).toEqual(24);
  });

  it('it returns empty costs when given an invalid booking', () => {
    startTime = new Moment().startOf('day').hour(14).minute(30).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bedTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime, endTime, bedTime);

    expect(bookingReturn.costs).toEqual({});
  });
});
