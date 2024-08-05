const { RoleEnum } = require('../constants');
const { hashPassword } = require('../helpers/encryption');
const { userService } = require('../services/');

/**
 * @desc Retrieves a user by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The ID of the user to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
exports.get = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(400).send('No user ID provided.');
    }

    const user = await userService.findOneByParam({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.json({ message: 'User retrieved successfully', data: user });
  } catch (e) {
    console.error('Error during getting user:', e);
    res.sendStatus(500);
  }
};
/**
 * @desc This function creates a new user record and returns a success message.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns a success message if the user is created successfully.
 */
exports.register = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    // Check if user already exists
    const existingUser = await userService.findOneByParam({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await hashPassword(password);
    // Create new user record
    await userService.create({ email, password: hashedPassword, ...rest });
    // Return 201 Created status code and success message
    res.status(201).send({ message: 'User created successfully' });
  } catch (e) {
    console.error('Error during signup:', e);
    res.sendStatus(500);
  }
};

/**
 * Update user by id
 * @param {object} req.body - The user data to update
 * @param {string} req.userId - The ID of the user to update
 * @return {object} - Returns a success message if the user is updated.
 */
exports.update = async (req, res) => {
  try {
    const { userId } = req;
    const { body } = req;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).send('Request body is empty or invalid');
    }

    const updatedUser = await userService.updateById({
      id: userId,
      params: body,
    });

    const message = updatedUser
      ? 'User updated successfully'
      : 'User not found or failed to update';

    res.status(200).send({ message });
  } catch (error) {
    res.status(500).send('Internal Server Error' + error);
  }
};

/**
 * Delete user by ID.
 * @throws {Error} - Throws an error if there's an issue deleting the user or if the user is an admin.
 * @return {object} - Returns a success message if the user is deleted.
 */
exports.delete = async (req, res) => {
  try {
    const { userId, userRole } = req;

    if (userRole === RoleEnum.ADMIN) {
      return res.status(403).send({ message: 'Admin user cannot be deleted' });
    }

    await userService.delete(userId);

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' + error });
  }
};
