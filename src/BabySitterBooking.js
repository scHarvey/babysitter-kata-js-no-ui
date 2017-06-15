'use strict';
import Moment from 'moment';
import RateCalculator from './RateCalculator';

/*
* BabySitterBooking factory
*/
export default () => {
  const _earliestStartTime = new Moment().startOf('day').hour(17).minute(0);
  const _latestEndTime = new Moment().startOf('day').hour(28).minute(0);
  const rateCalculator = RateCalculator();
  let calcReturn = {};
  let response = {};

  function unixToMoment(time) {
    return Moment.unix(time);
  }
  function validateStartTime(startTime, endTime) {
    if (startTime.isAfter(endTime)) {
      response = {
        code: 400,
        message: 'Start Time can not be later than End Time.'
      };
    } else if (startTime.isBefore(_earliestStartTime)) {
      response = {
        code: 400,
        message: 'Start time is earlier than the allowed time.'
      };
    } else if (startTime.isSameOrBefore(_latestEndTime)){
      response = {
        code: 200,
        message: 'OK'
      };
    } else {
      response = {};
    }

    if (response.code == 200) {

    }
    return response;
  }

  function validateEndTime(endTime, startTime) {
    if (endTime.isBefore(startTime)){
      response = {
        code: 400,
        message: 'End Time can not be earlier than Start Time.'
      };
    } else if (endTime.isAfter(_latestEndTime)) {
      response = {
        code: 400,
        message: 'End time is later than the allowed time.'
      };
    } else if (endTime.isSameOrBefore(_latestEndTime)){
      response = {
        code: 200,
        message: 'OK'
      };
    } else {
      response = {};
    }
    return response;
  }
  return {
    validateBooking(startTime, endTime = _latestEndTime, bedTime = _latestEndTime) {
      //since javascript doesn't handle first parameters with default values well
      if (startTime == null) {
        startTime = _earliestStartTime;
      }

      if (typeof startTime == 'string') {
          startTime = unixToMoment(startTime);
      }

      if (typeof endTime == 'string') {
          endTime = unixToMoment(endTime);
      }

      if (typeof bedTime == 'string') {
          bedTime = unixToMoment(bedTime);
      }

      let startTimeResponse = validateStartTime(startTime, endTime);
      let endTimeResponse = validateEndTime(endTime, startTime);

      if (startTimeResponse.code == 200 && endTimeResponse.code == 200) {
        calcReturn = rateCalculator.caclulateRate(startTime, endTime, bedTime)
      }

      return {
        'startTimeResponse': startTimeResponse,
        'endTimeResponse': endTimeResponse,
        'costs': calcReturn
      };
    }
  };
}
