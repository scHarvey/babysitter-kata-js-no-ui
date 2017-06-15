'use strict';
import Moment from 'moment';
import RateCalculator from './RateCalculator';

/*
* BabySitterBooking factory
*/
export default () => {
  const _earliestStartTime = new Moment().startOf('day').hour(17).minute(0);
  const _latestEndTime = new Moment().startOf('day').hour(28).minute(0);
  const _rateCalculator = RateCalculator();
  let _calcReturn = {};
  let _response = {};

  function unixToMoment(time) {
    return Moment.unix(time);
  }
  function validateStartTime(startTime, endTime) {
    if (startTime.isAfter(endTime)) {
      _response = {
        code: 400,
        message: 'Start Time can not be later than End Time.'
      };
    } else if (startTime.isBefore(_earliestStartTime)) {
      _response = {
        code: 400,
        message: 'Start time is earlier than the allowed time.'
      };
    } else if (startTime.isSameOrBefore(_latestEndTime)){
      _response = {
        code: 200,
        message: 'OK'
      };
    } else {
      _response = {};
    }

    if (_response.code == 200) {

    }
    return _response;
  }

  function validateEndTime(endTime, startTime) {
    if (endTime.isBefore(startTime)){
      _response = {
        code: 400,
        message: 'End Time can not be earlier than Start Time.'
      };
    } else if (endTime.isAfter(_latestEndTime)) {
      _response = {
        code: 400,
        message: 'End time is later than the allowed time.'
      };
    } else if (endTime.isSameOrBefore(_latestEndTime)){
      _response = {
        code: 200,
        message: 'OK'
      };
    } else {
      _response = {};
    }
    return _response;
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
        _calcReturn = _rateCalculator.caclulateRate(startTime, endTime, bedTime)
      } else {
        _calcReturn = {};
      }

      return {
        'startTimeResponse': startTimeResponse,
        'endTimeResponse': endTimeResponse,
        'costs': _calcReturn
      };
    }
  };
}
