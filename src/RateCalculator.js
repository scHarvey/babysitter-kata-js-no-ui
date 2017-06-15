'use strict';
import Moment from 'moment';

/*
* RateCalculator factory
*/
export default () => {
  const _hourlyRates = {
    beforeBedTime: 12,
    afterBedTime: 8,
    afterMidnight: 16
  };

  function unixToMoment(time) {
    return Moment.unix(time);
  }

  function calcBeforeBedHours(startTime, bedTime, totalHours, requiresRounding) {
    let beforeBedDuration = new Moment.duration(bedTime.diff(startTime));
    let beforeBedHours = 0
    if (requiresRounding) {
      beforeBedHours = Math.ceil(beforeBedDuration.asHours());
    } else {
      beforeBedHours = beforeBedDuration.asHours();
    }
    if (beforeBedHours > totalHours) {
        beforeBedHours = totalHours;
    } else if (beforeBedHours < 0) {
        beforeBedHours = 0;
    }
    return beforeBedHours;
  }

  function calcAfterBedHours(bedTime, endTime, totalHours, requiresRounding) {
    let afterBedDuration = new Moment.duration(endTime.diff(bedTime));
    let afterBedHours = 0

    if (requiresRounding) {
      afterBedHours = Math.ceil(afterBedDuration.asHours());
    } else {
      afterBedHours = afterBedDuration.asHours();
    }
    if (afterBedHours > totalHours) {
        afterBedHours = totalHours;
    }
    return afterBedHours;
  }

  function calcAfterMidnightHours(endTime, requiresRounding) {
    let afterMidnightDuration = new Moment.duration(endTime.diff(Moment().startOf('day').hours(24)));
    let afterMidnightHours = 0;
    if (requiresRounding) {
      afterMidnightHours = Math.ceil(afterMidnightDuration.asHours());
    } else {
      afterMidnightHours = afterMidnightDuration.asHours();
    }
    if (afterMidnightHours < 0) {
      afterMidnightHours = 0;
    }
    return afterMidnightHours;
  }

  return {
    caclulateRate(startTime, endTime, bedTime) {
      let requiresRounding = false;

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
      let totalHours = totalDuration.asHours();
      if (totalHours < Math.ceil(totalHours)) {
        totalHours = Math.ceil(totalHours);
        requiresRounding = true;
      }

      let beforeBedHours = calcBeforeBedHours(startTime, bedTime, totalHours, requiresRounding);
      let afterBedHours = calcAfterBedHours(bedTime, endTime, totalHours, requiresRounding);
      let afterMidnightHours = calcAfterMidnightHours(endTime, requiresRounding);

      return {
        totalCost: beforeBedHours * _hourlyRates.beforeBedTime + (afterBedHours-afterMidnightHours) *  _hourlyRates.afterBedTime + afterMidnightHours * _hourlyRates.afterMidnight,
        beforeBedCost: beforeBedHours * _hourlyRates.beforeBedTime,
        afterBedCost: (afterBedHours-afterMidnightHours) *  _hourlyRates.afterBedTime,
        afterMidnightCost: afterMidnightHours * _hourlyRates.afterMidnight
        };
    }
  };
}
