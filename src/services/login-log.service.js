const { loginLog } = require('../models');

/**
 @desc This is the loginLogService class responsible for handling login history collection documents
 @return loginLogService object
 */

class LoginLogService {
  /**
   @desc Finds one login history by parameter
   @param param - The parameter to search for
   @return Promise that resolves to a login history object
   */
  findOneByParam(param) {
    return loginLog.findOne(param);
  }

  /**
   @desc Finds one login history by id and updates its parameters
   @param data - An object containing the id and parameters to update
   @return Promise that resolves to a login history object
   */
  updateById(data) {
    const { id, params } = data;
    return loginLog.findByIdAndUpdate(id, params);
  }

  /**

   @desc Creates a new login history document
   @param data - An object containing login history data
   @return Promise that resolves to a login history object
   */
  create(data) {
    return loginLog.create(data);
  }

  /**
   * @desc Find login history documents by query data
   * @param {Object} data - An object contains query data
   * @returns
   */
  find(data) {
    return loginLog.find(data);
  }
}

module.exports = new LoginLogService();
