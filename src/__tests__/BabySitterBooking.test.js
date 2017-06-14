'use strict';

import Moment from 'moment';
import BabySitterBooking from '../BabySitterBooking';

const babySitterBooking = BabySitterBooking();
let startTime = null;

describe('BabysitterBooking startTime ', () => {

  it('returns a 400 error if startTime is earlier than 5:00PM', () => {
    startTime = new Moment().startOf('day').hour(16).minute(30).format('X');
    let bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.code).toEqual(400);
    expect(bookingReturn.message).toEqual('Start time is earlier than the allowed time.');
  });

  it('returns a 200 OK if startTime is between than 5:00PM and 4:00AM tomorrow', () => {
    startTime = new Moment().startOf('day').hour(17).minute(30).format('X');
    let bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.code).toEqual(200);
    expect(bookingReturn.message).toEqual('OK');
  });

  it('returns a 200 OK if startTime is exactly 5:00PM', () => {
      startTime = new Moment().startOf('day').hour(17).minute(0).format('X');
      let bookingReturn = babySitterBooking.validateBooking(startTime);

      expect(bookingReturn.code).toEqual(200);
      expect(bookingReturn.message).toEqual('OK');
    });

  it('returns a 200 OK if startTime is the next morning before 4am', () => {
    startTime = new Moment().startOf('day').hour(26).minute(30).format('X');
    let bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.code).toEqual(200);
    expect(bookingReturn.message).toEqual('OK');
  });

});
