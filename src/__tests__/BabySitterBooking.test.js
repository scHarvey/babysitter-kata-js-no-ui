'use strict';

import Moment from 'moment';
import BabySitterBooking from '../BabySitterBooking';

const babySitterBooking = BabySitterBooking();
let bookingReturn = null;
let startTime = null;
let endTime = null;

beforeEach(() => {
  // reset testing vars
  bookingReturn = null;
  startTime = null;
  endTime = null;
});

describe('BabysitterBooking startTime ', () => {

  it('returns a 400 error if startTime is earlier than 5:00PM', () => {
    startTime = new Moment().startOf('day').hour(16).minute(30).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.startTimeResponse.code).toEqual(400);
    expect(bookingReturn.startTimeResponse.message).toEqual('Start time is earlier than the allowed time.');
  });

  it('returns a 200 OK if startTime is between than 5:00PM and 4:00AM tomorrow', () => {
    startTime = new Moment().startOf('day').hour(17).minute(30).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.startTimeResponse.code).toEqual(200);
    expect(bookingReturn.startTimeResponse.message).toEqual('OK');
  });

  it('returns a 200 OK if startTime is exactly 5:00PM', () => {
      startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
      bookingReturn = babySitterBooking.validateBooking(startTime);

      expect(bookingReturn.startTimeResponse.code).toEqual(200);
      expect(bookingReturn.startTimeResponse.message).toEqual('OK');
    });

  it('returns a 200 OK if startTime is the next morning before 4am', () => {
    startTime = new Moment().startOf('day').hour(26).minute(30).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.startTimeResponse.code).toEqual(200);
    expect(bookingReturn.startTimeResponse.message).toEqual('OK');
  });

  it('returns a 400 if startTime is after endTime', () => {
    startTime = new Moment().startOf('day').hour(19).minute(30).format('X');
    endTime = new Moment().startOf('day').hour(19).minute(0).format('X');
    bookingReturn = babySitterBooking.validateBooking(startTime, endTime);

    expect(bookingReturn.startTimeResponse.code).toEqual(400);
    expect(bookingReturn.startTimeResponse.message).toEqual('Start Time can not be later than End Time.');
  });
});

describe('BabysitterBooking endTime ', () => {
  it('returns a 400 error if endTime is later than 4:00AM', () => {
      endTime = new Moment().startOf('day').hour(30).minute(0).format('X');
      bookingReturn = babySitterBooking.validateBooking(null, endTime);

      expect(bookingReturn.endTimeResponse.code).toEqual(400);
      expect(bookingReturn.endTimeResponse.message).toEqual('End time is later than the allowed time.');
    });

  it('returns a 200 if endTime is earlier than 4:00AM', () => {
    endTime = new Moment().startOf('day').hour(24).minute(30).format('X');
    bookingReturn = babySitterBooking.validateBooking(null, endTime);

    expect(bookingReturn.endTimeResponse.code).toEqual(200);
    expect(bookingReturn.endTimeResponse.message).toEqual('OK');
  });
});
