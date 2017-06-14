'use strict';
import Moment from 'moment';


/*
* BabySitterBooking factory
*/
export default () => {
  const _earliestStartTime = new Moment().startOf('day').hour(17).minute(0);
  const _latestEndTime = new Moment().startOf('day').hour(28).minute(0);

  let response = {};
  return {
    validateBooking(startTime = _earliestStartTime, endTime = _latestEndTime) {
      if (Moment.unix(startTime).isAfter(Moment.unix(endTime))) {
        response = {
          code: 400,
          message: 'Start Time can not be later than End Time.'
        };
      } else if (Moment.unix(startTime).isBefore(_earliestStartTime)) {
        response = {
          code: 400,
          message: 'Start time is earlier than the allowed time.'
        };
      } else if (Moment.unix(startTime).isSameOrBefore(_latestEndTime)){
        response = {
          code: 200,
          message: 'OK'
        };
      } else {
        response = {};
      }
      return response;
    }
  };
}
