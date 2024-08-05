const { loginLog } = require('../models');

/**
 @desc This is the loginLogService class responsible for handling login history collection documents
 @return loginLogService object
 */

class LoginLogService {
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
