const { User } = require('../models');

/**
 @desc This is the UserService class responsible for handling user collection documents
 @return UserService object
 */

class UserService {
  /**
   @desc Finds one user by parameter
   @param param - The parameter to search for
   @return Promise that resolves to a user object
   */
  findOneByParam(param) {
    return User.findOne(param);
  }

  /**
   @desc Finds one user by id and updates its parameters
   @param data - An object containing the id and parameters to update
   @return Promise that resolves to a user object
   */
  updateById(data) {
    const { id, params } = data;
    return User.findByIdAndUpdate(id, params);
  }
  /**

   @desc Creates a new user
   @param data - An object containing user data
   @return Promise that resolves to a user object
   */
  create(data) {
    return User.create(data);
  }
  /**

   @desc Deletes a user by id
   @param id - The id of the user to delete
   @return None
   */
  delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
