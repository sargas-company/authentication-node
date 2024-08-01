const { transferMail } = require('../config/email.js');
const { hashPassword } = require('../helpers/encryption');
const { MailTitle } = require('../constants/');
const constants = require('../config/constants');
const { generateToken, calculateTimeInterval } = require('../helpers');
const { userService } = require('../services/');
const { loginLogService } = require('../services/');
const { verifyPassword } = require('../helpers/encryption');
const { verifyToken } = require('../helpers');
const { ActionEnum } = require('../constants');

/**

 @desc This function handles user login and returns access and refresh tokens.
 @return {Object} - Returns access and refresh tokens if the user is authenticated.
 */

exports.login = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Validate that email and password are present in the request body
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await userService.findOneByParam({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const currentTime = new Date();
    // Check if user is locked
    if (user.isLock && user.lockRegTime) {
      const lockPeriod = await calculateTimeInterval(
        user.lockRegTime,
        currentTime,
      );

      if (lockPeriod < constants.userLock.lockPeriod) {
        return res.status(401).send({
          message:
            'You have attempted 5 times with the wrong password. Please try again after 2 hours',
          timeLeft: lockPeriod,
        });
      }
    }

    // Compare passwords using hash-verify function
    const isPasswordValid = await verifyPassword(password, user?.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await logFailedLoginAttempt(user, currentTime);

      // Lock user if they exceed allowed attempts
      await lockUserIfExceededAttempts(user, currentTime);

      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Log successful login attempt and remove user lock
    await logSuccessfulLoginAttempt(user, currentTime);

    // Generate access and refresh tokens, and update the user
    const { accessToken, refreshToken } = await generateAndSaveTokens(user);

    // Send the access and refresh tokens in the response body
    res.send({ accessToken, refreshToken });
  } catch (error) {
    // If any error occurs, log the error and send 500 Internal Server Error status
    console.error('Error during login:', error);
    res.sendStatus(500);
  }
};

async function logFailedLoginAttempt(user, currentTime) {
  await loginLogService.create({
    userId: user._id,
    isSuccess: false,
    regTime: currentTime,
  });
}

async function lockUserIfExceededAttempts(user, currentTime) {
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
}

async function logSuccessfulLoginAttempt(user, currentTime) {
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
}
async function generateAndSaveTokens(user) {
  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateToken({
    user,
    action: ActionEnum.LOGIN,
  });

  // Update the user with the new refresh token
  await userService.updateById({
    id: user.id,
    params: {
      refreshToken,
    },
  });

  return { accessToken, refreshToken };
}

/**
 *
 * @desc This function regenerate access token and refresh token ,and update them in DB when refresh token is alive
 * @param {object} req.body - The user data to update
 * @returns return new access token and refresh
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const { userId } = await verifyToken(ActionEnum.USER_REFRESH, refreshToken);

    const user = await userService.findOneByParam({ _id: userId });
    if (!user) {
      return res.status(500).send({ message: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateToken({
      user,
      action: ActionEnum.LOGIN,
    });

    await userService.updateById(user.id, { refreshToken: newRefreshToken });

    res.send({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).send({ message: 'Failed to refresh token' });
  }
};

/**
 *
 * @desc This function send email containing reset password link to users
 * @param {object} req.body - The user data to update
 * @returns {object} - Returns a success message if the email sent successfully.
 */
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  // Validate that email is present in the request body
  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const existingUser = await userService.findOneByParam({ email });

  const resetPasswordToken = await generateToken({
    user: existingUser,
    action: ActionEnum.RESET_PASSWORD,
  });

  const message = `<html>To reset your password, <a href="${constants.BASE_URL}/reset_password/${resetPasswordToken}">click here</a>.</html>`;
  const isMailSent = await transferMail(
    email,
    MailTitle.RESET_PASSWORD,
    message,
  );
  if (isMailSent) {
    res.status(200).send({ message: 'Reset password email sent successfully' });
  } else {
    res.status(500).send({ message: 'Internal server error' });
  }
};

/**
 *
 * @desc This function checks reset password token validity and updates the password of an existing user
 * @param {object} req.body - The user data to update
 * @param {string} req.params.token - reset password token
 * @returns {object} - Returns a success message if the user is updated.
 */
exports.updatePassword = async (req, res) => {
  const { userId } = await verifyToken(
    ActionEnum.RESET_PASSWORD,
    req.params.token,
  );
  const { password } = req.body;
  if (userId) {
    const existingUser = await userService.findOneByParam({ _id: userId });

    if (!existingUser) {
      return res.status(404).send({ message: 'User does not exist' });
    }

    const isNewPasswordSame = await verifyPassword(
      password,
      existingUser.password,
    );

    if (isNewPasswordSame) {
      return res
        .status(400)
        .send({ message: 'New password should not be same as old password' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    // Update password of existing user and remove lock
    const updateData = {
      id: existingUser._id,
      params: {
        password: hashedPassword,
        isLock: false,
        $unset: { lockRegTime: 1 },
      },
    };
    await userService.updateById(updateData);

    return res.status(200).send({ message: 'Password updated successfully' });
  } else {
    return res.status(401).send({ message: 'Token expired' });
  }
};
