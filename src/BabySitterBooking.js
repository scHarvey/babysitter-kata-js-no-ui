'use strict';
import Moment from 'moment';


/*
* BabySitterBooking factory
*/
export default () => {
  const _earliestStartTime = new Moment().startOf('day').hour(17).minute(0);
  const _latestEndTime = new Moment().startOf('day').hour(28).minute(0);

  let response = {};

  function validateStartTime(startTime, endTime) {
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

  function validateEndTime(endTime, startTime) {
    if (Moment.unix(endTime).isAfter(_latestEndTime)) {
      response = {
        code: 400,
        message: 'End time is later than the allowed time.'
      };
    } else {
      response = {};
    }
    return response;
  }
  return {
    validateBooking(startTime = _earliestStartTime, endTime = _latestEndTime) {
      let startTimeResponse = validateStartTime(startTime, endTime);
      let endTimeResponse = validateEndTime(endTime, startTime);
      return {
        'startTimeResponse': startTimeResponse,
        'endTimeResponse': endTimeResponse
      };
    }
  };
}
