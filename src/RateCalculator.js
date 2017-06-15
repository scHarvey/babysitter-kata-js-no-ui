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

  function calcBeforeBedHours(startTime, bedTime, totalHours) {
    let beforeBedDuration = new Moment.duration(bedTime.diff(startTime));
    let beforeBedHours = beforeBedDuration.asHours();

    if (beforeBedHours > totalHours) {
        beforeBedHours = totalHours;
    } else if (beforeBedHours < 0) {
        beforeBedHours = 0;
    }
    return beforeBedHours;
  }

  function calcAfterBedHours(bedTime, endTime, totalHours) {
    let afterBedDuration = new Moment.duration(endTime.diff(bedTime));
    let afterBedHours = afterBedDuration.asHours();

    if (afterBedHours > totalHours) {
        afterBedHours = totalHours;
    }
    return afterBedHours;
  }

  function calcAfterMidnightHours(endTime) {
    let afterMidnightDuration = new Moment.duration(endTime.diff(Moment().startOf('day').hours(24)));
    let afterMidnightHours = afterMidnightDuration.asHours();

    if (afterMidnightHours < 0) {
      afterMidnightHours = 0;
    }
    return afterMidnightHours;
  }

  return {
    caclulateRate(startTime, endTime, bedTime, testID = null) {
      let requiresRounding = false;
      let leftOverTime = 0
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

      let beforeBedHours = calcBeforeBedHours(startTime, bedTime, totalHours);
      let afterBedHours = calcAfterBedHours(bedTime, endTime, totalHours);
      let afterMidnightHours = calcAfterMidnightHours(endTime);

      //compensate for bedTimeHours afterMidnightHours
      afterBedHours = afterBedHours - afterMidnightHours;

      if (requiresRounding) {
        leftOverTime = totalHours - (beforeBedHours + afterBedHours + afterMidnightHours);
        if (afterMidnightHours > 0) {
          afterMidnightHours += leftOverTime;
        } else if (afterBedHours > 0) {
          afterBedHours += leftOverTime;
        } else {
          beforeBedHours += leftOverTime;
        }
      }

      return {
        totalCost: beforeBedHours * _hourlyRates.beforeBedTime + afterBedHours *  _hourlyRates.afterBedTime + afterMidnightHours * _hourlyRates.afterMidnight,
        beforeBedCost: beforeBedHours * _hourlyRates.beforeBedTime,
        afterBedCost:  afterBedHours*  _hourlyRates.afterBedTime,
        afterMidnightCost: afterMidnightHours * _hourlyRates.afterMidnight
        };
    }
  };
}
