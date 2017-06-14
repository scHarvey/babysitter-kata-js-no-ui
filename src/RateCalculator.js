'use strict';
import Moment from 'moment';

/*
* RateCalculator factory
*/
export default () => {
  const _hourlyRates = {
    beforeBedTime: 12,
    afterBedTime: 8
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

      let beforeBedDuration = new Moment.duration(bedTime.diff(startTime));
      let beforeBedHours = Math.round(beforeBedDuration.asHours());
      if (beforeBedHours < 0) {
        beforeBedHours = 0;
      }

      let afterBedDuration = new Moment.duration(endTime.diff(bedTime));
      let afterBedHours = Math.round(afterBedDuration.asHours());
      if (afterBedHours < 0) {
        afterBedHours = 0;
      }

      return {
        totalCost: beforeBedHours * _hourlyRates.beforeBedTime + afterBedHours *  _hourlyRates.afterBedTime,
        beforeBedCost: beforeBedHours * _hourlyRates.beforeBedTime

        };
    }
  };
}
