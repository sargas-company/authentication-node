const constants = require('../config/constants');
const { loginLogService, userService } = require('../services');
const { User } = require('../models');
/**
 * Logs a failed login attempt for a user.
 *
 * @param {User} user - The user object.
 * @param {string} user._id - The ID of the user.
 * @param {Date} currentTime - The current time.
 * @returns {Promise<void>}
 */
const logFailedLoginAttempt = async (user, currentTime) => {
  await loginLogService.create({
    userId: user._id,
    isSuccess: false,
    regTime: currentTime,
  });
};

/**
 * Locks the user account if the number of failed login attempts exceeds the allowed limit within the lock period.
 *
 * @param {User} user - The user object.
 * @param {string} user._id - The ID of the user.
 * @param {string} user.id - The ID of the user.
 * @param {Date} currentTime - The current time.
 * @returns {Promise<void>}
 */
const lockUserIfExceededAttempts = async (user, currentTime) => {
  const comparedHoursAgoTime = new Date(
    currentTime.getTime() - constants.userLock.lockPeriod * 60 * 1000,
  );
  const attemptFail = await loginLogService.find({
    userId: user._id,
    isSuccess: false,
    regTime: {
      $gte: comparedHoursAgoTime,
      $lte: currentTime,
    },
  });
  if (attemptFail.length === constants.userLock.attemptNumber - 1) {
    await userService.updateById({
      id: user.id,
      params: {
        isLock: true,
        lockRegTime: currentTime,
      },
    });
  }
};

/**
 * Logs a successful login attempt for a user and unlocks the user account if it was previously locked.
 *
 * @param {User} user - The user object.
 * @param {string} user._id - The ID of the user.
 * @param {string} user.id - The ID of the user.
 * @param {Date} currentTime - The current time.
 * @returns {Promise<void>}
 */
const logSuccessfulLoginAttempt = async (user, currentTime) => {
  await loginLogService.create({
    userId: user._id,
    isSuccess: true,
    regTime: currentTime,
  });
  await userService.updateById({
    id: user.id,
    params: {
      isLock: false,
      $unset: { lockRegTime: 1 },
    },
  });
};

module.exports = {
  logFailedLoginAttempt,
  lockUserIfExceededAttempts,
  logSuccessfulLoginAttempt,
};
