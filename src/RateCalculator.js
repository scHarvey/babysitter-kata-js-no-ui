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
   * Calculates the before bed hours to be used in our cost calculation.
   * @method
   * @param {Moment} startTime - a moment object representing the booking start time
   * @param {Moment} bedTime - a moment object representing the booking bed time
   * @param {number} totalHours - total length of the booking
   * @returns a number representing the number of hours in this category
  */
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

  /**
   * Calculates the after bed time hours to be used in our cost calculation.
   * @method
   * @param {Moment} bedTime - a moment object representing the booking bed time
   * @param {Moment} endTime - a moment object representing the booking end time
   * @param {number} totalHours - total length of the booking
   * @returns a number representing the number of hours in this category
  */
  function calcAfterBedHours(bedTime, endTime, totalHours) {
    let afterBedDuration = new Moment.duration(endTime.diff(bedTime));
    let afterBedHours = afterBedDuration.asHours();

    if (afterBedHours > totalHours) {
        afterBedHours = totalHours;
    }
    return afterBedHours;
  }

  /**
   * Calculates the before bed hours to be used in our cost calculation.
   * @method
   * @param {Moment} endTime - a moment object representing the booking end time
   * @returns a number representing the number of hours in this category
  */
  function calcAfterMidnightHours(endTime) {
    let afterMidnightDuration = new Moment.duration(endTime.diff(Moment().startOf('day').hours(24)));
    let afterMidnightHours = afterMidnightDuration.asHours();

    if (afterMidnightHours < 0) {
      afterMidnightHours = 0;
    }
    return afterMidnightHours;
  }

  function calcCostBreakDown(beforeBedHours, afterBedHours, afterMidnightHours, totalHours) {
    let leftOverTime = 0;
    //compensate for bedTimeHours after midnight
    afterBedHours = afterBedHours - afterMidnightHours;

    if (totalHours > beforeBedHours + afterBedHours + afterMidnightHours) {
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

  return {
    /**
     * Caculates the cost for a booking given start, end and bed times, using private methods to calculate hours within each cost category.
     * @method
     * @param {Moment} startTime - a moment object representing the booking start time
     * @param {Moment} endTime - a moment object representing the booking end time
     * @param {Moment} bedTime - a moment object representing the booking bed time
     * @returns an object containing total cost and the cost for each individual category
    */
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
      let totalHours = totalDuration.asHours();
      if (totalHours < Math.ceil(totalHours)) {
        totalHours = Math.ceil(totalHours);
      }

      let beforeBedHours = calcBeforeBedHours(startTime, bedTime, totalHours);
      let afterBedHours = calcAfterBedHours(bedTime, endTime, totalHours);
      let afterMidnightHours = calcAfterMidnightHours(endTime);

      return calcCostBreakDown(beforeBedHours, afterBedHours, afterMidnightHours, totalHours);
    }
  };
}
