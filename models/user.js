const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class UserModel {

    /**
   * Creates a new user record
   * @param  {Object}      data [User data]
   * @return {Object|null}      [Created user record]
   */
    async create(data) {
      try {
  
        // Generate SQL statement - using helper for dynamic parameter injection
        const statement = pgp.helpers.insert(data, null, 'users') + 'RETURNING *';
    
        // Execute SQL statment
        const result = await db.query(statement);
  
        if (result.rows?.length) {
          return result.rows[0];
        }
  
        return null;
  
      } catch(err) {
        throw new Error(err);
      }
    }

  /**
   * Finds a user record by email
   * @param  {String}      email [Email address]
   * @return {Object|null}       [User record]
   */
  async findOneByEmail(email) {
    try {

      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE email = $1`;
      const values = [email];
  
      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw new Error(err);
    }
  }
}