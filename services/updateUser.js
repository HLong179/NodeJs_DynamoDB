const {ddbClient, ddb} = require('../dbClient/ddbClient');
const { CUSTOMER_ID, TABLE_NAME } = require('../shared/constants');

const updateUserInfo = (updatedData) => {
    const {email, firstName, lastName, role, metaData} = updatedData;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
            sk: `EMAIL::${email}`,
        },
        UpdateExpression: 'set first_name = :firstName, last_name = :lastName, #r = :role, meta_data = :metaData',
        // Because role is a reversed word so we need to specify it in the ExpressionAttributeNames
        ExpressionAttributeNames: {
            '#r': 'role'
        },
        ExpressionAttributeValues: {
            ':firstName': firstName,
            ':lastName': lastName,
            ':role': role,
            ':metaData': metaData
        }
    }
    return ddbClient.update(params).promise();
}

module.exports = {updateUserInfo};