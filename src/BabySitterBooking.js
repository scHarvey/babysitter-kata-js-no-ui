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

  /**
   * Turns a unix date string into a moment date object.
   * @method
   * @param {string} time - A a unix time string
   * @returns a moment time object
  */
  function unixToMoment(time) {
    return Moment.unix(time);
  }

  /**
   * validates our booking start time based on start and end time, comparing it to global earliest start and latest end times.
   * @method
   * @param {Moment} startTime - a moment object representing the booking start time
   * @param {Moment} endTime - a moment object representing the booking end time
   * @returns a response object with code and message
  */
  function validateStartTime(startTime, endTime) {
    let response = {};
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

  /**
   * validates our booking end time based on end and start time, comparing it to global earliest start and latest end times.
   * @method
   * @param {Moment} endTime - a moment object representing the booking end time
   * @param {Moment} startTime - a moment object representing the booking start time
   * @returns a response object with code and message
  */
  function validateEndTime(endTime, startTime) {
    let response = {};
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
    /**
     * validates our booking using private methods to validate start and end times, if valid calculates our price.
     * @method
     * @param {Moment|string} startTime - a moment object or string representing the booking start time
     * @param {Moment|string} endTime - a moment object or string representing the booking end time
     * @param {Moment|string} bedTime - a moment object or string representing the booking bed time
     * @returns a response object with code and message and a cost breakdown
    */
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
      let calcReturn = {};
      if (startTimeResponse.code == 200 && endTimeResponse.code == 200) {
        calcReturn = _rateCalculator.caclulateRate(startTime, endTime, bedTime)
      }
      return {
        'startTimeResponse': startTimeResponse,
        'endTimeResponse': endTimeResponse,
        'costs': calcReturn
      };
    }
  };
}
