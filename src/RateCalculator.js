'use strict';
import Moment from 'moment';

/*
* RateCalculator factory
*/
export default () => {
  const _hourlyRates = {
    beforeBedTime: 12
  };

  function unixToMoment(time) {
    return Moment.unix(time);
  }

  return {
    caclulateRate(startTime, endTime, bedTime) {
      if (typeof startTime == 'string') {
          startTime = unixToMoment(startTime);
      }

      if (typeof endTime == 'string') {
          endTime = unixToMoment(endTime);
      }

      if (typeof bedTime == 'string') {
          bedTime = unixToMoment(bedTime);
      }

      let totalDuration = new Moment.duration(endTime.diff(startTime));
      let rate = totalDuration.asHours() * _hourlyRates.beforeBedTime;

      return {rate: rate};
    }
  };
}
