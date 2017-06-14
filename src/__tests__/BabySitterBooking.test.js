'use strict';

import Moment from 'moment';
import BabySitterBooking from '../BabySitterBooking';

describe('BabysitterBooking startTime ', () => {

  it('returns a 400 error if startTime is earlier than 5:00PM', () => {
    let babySitterBooking = BabySitterBooking();
    const startTime = new Moment().startOf('day').hour(16).minute(30).format('X');
    let bookingReturn = babySitterBooking.validateBooking(startTime);

    expect(bookingReturn.code).toEqual(400);
    expect(bookingReturn.message).toEqual('Start time is earlier than the allowed time.');
  });

});
