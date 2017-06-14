'use strict';
import Moment from 'moment';


/*
* BabySitterBooking factory
*/
export default () => {
  const _earliestStartTime = new Moment().startOf('day').hour(17).minute(0);
  let response = {};
  return {
    validateBooking(startTime) {
      if (Moment.unix(startTime).isBefore(_earliestStartTime)) {
        response = {
          code: 400,
          message: 'Start time is earlier than the allowed time.'
        };
      } else {
        response = {};
      }
      return response;
    }
  };
}
