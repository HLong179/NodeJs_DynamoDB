const {ddb, ddbClient} = require('../dbClient/ddbClient');
const { TABLE_NAME } = require('../shared/constants');

const queryAllUsersByCustomerId = (customerId) => {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ':customerId': `CUSTOMER_ID::${customerId}`
        },
        KeyConditionExpression: 'pk = :customerId'
    };

    return ddbClient.query(params).promise();
}

const getUserByCustomerIdAndEmail = (customerId, email) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            pk: `CUSTOMER_ID::${customerId}`,
            sk: `EMAIL::${email}`
        }
    };

    return ddbClient.get(params).promise();
}

const scanUserTable = () => {
    const params = {
        TableName: TABLE_NAME
    };

    return ddbClient.scan(params).promise();
}


module.exports = {queryAllUsersByCustomerId, getUserByCustomerIdAndEmail, scanUserTable};