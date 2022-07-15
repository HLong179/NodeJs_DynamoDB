const {ddbClient, ddb} = require('../dbClient/ddbClient');
const { CUSTOMER_ID, TABLE_NAME } = require('../shared/constants');

const generateBatchDeleteUserParams = (emails) => {
    return emails.map(email => {
        return {
            DeleteRequest: {
                Key: {
                    pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
                    sk: `EMAIL::${email}`,
                }
            }
        };
    });
}

const batchDeleteUsers = (emails) => {
    const params = {
        RequestItems: {
            [TABLE_NAME]: generateBatchDeleteUserParams(emails)
        }
    };

    return ddbClient.batchWrite(params).promise();
};

module.exports = {batchDeleteUsers};