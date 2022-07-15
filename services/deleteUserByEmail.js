const {ddb, ddbClient} = require('../dbClient/ddbClient');
const { CUSTOMER_ID, TABLE_NAME } = require('../shared/constants');

const deleteUserByEmail = (email) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
            sk: `EMAIL::${email}`,
        }
    };

    return ddbClient.delete(params).promise();
}

module.exports = {deleteUserByEmail};