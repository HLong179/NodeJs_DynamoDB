const {ddbClient} = require('../dbClient/ddbClient');
const { CUSTOMER_ID, TABLE_NAME } = require('../shared/constants');

const batchReadUsers = () => {
    const params = {
        RequestItems: {
            [TABLE_NAME]: {
                Keys: [
                    {
                        pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
                        sk: `EMAIL::ABC@gmail.com`
                    },
                    {
                        pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
                        sk: `EMAIL::long1@gmail.com`
                    }
                ]
            }
        }
    };

    return ddbClient.batchGet(params).promise();
}

module.exports = {batchReadUsers};