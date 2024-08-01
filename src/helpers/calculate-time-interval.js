/**
 * @desc This function calculates interval of two timestamps in minutes
 * @param {Date} startTime start time of time interval
 * @param {Date} endTime end time of time interval
 * @returns number of minutes between start time and end time
 */
const calculateTimeInterval = async (startTime, endTime) => {
  const intervalInMilliseconds = endTime.getTime() - startTime.getTime();
  return Math.round(intervalInMilliseconds / 1000 / 60);
};

module.exports = calculateTimeInterval;
