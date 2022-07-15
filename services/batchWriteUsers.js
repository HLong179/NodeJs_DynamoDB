const {ddb, ddbClient} = require('../dbClient/ddbClient');
const { User } = require('../models/user');
const { CUSTOMER_ID, TABLE_NAME } = require('../shared/constants');

const generateBatchUsersData = (startIndex, count) => {
    const users = [];
    for (let index = startIndex; index < startIndex + count; index++) {
        const user = new User(
            `Long${index}`,
            `Le${index}`,
            'user',
            'male',
            `long${index}@gmail.com`,
            `111${index}`,
            {
                age: index,
                address: 'Ha Tinh'
            }
        );

        users.push({
            ...user,
            pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
            sk: `EMAIL::${user.email}`
        });
    }

    return users;
}

const batchWriteUsers = (startIndex, count) => {
    const batchUserData = generateBatchUsersData(startIndex, count);
    const requestParams = batchUserData.map(userData => {
        const {firstName, lastName, metadata, ...rest} = userData;
        return {
            PutRequest: {
                Item: {
                    ...rest,
                    first_name: firstName,
                    last_name: lastName,
                    meta_data: metadata
                }
            }
        }
    });

    const params = {
        RequestItems: {
            [TABLE_NAME]: requestParams
        }
    }

    return ddbClient.batchWrite(params).promise();
}

module.exports = {batchWriteUsers};