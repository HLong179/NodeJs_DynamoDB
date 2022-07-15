const {ddbClient} = require('../dbClient/ddbClient');
const {CUSTOMER_ID, TABLE_NAME} = require('../shared/constants');

const addNewUser = (user) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
          pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
          sk: `EMAIL::${user.email}`,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          gender: user.gender,
          password: user.password,
          meta_data: {
            age: user.age.toString(),
            address: user.address
          }
        }
      };
    
    return ddbClient.put(params).promise();
}

module.exports = {addNewUser};