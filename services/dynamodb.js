const {ddbClient} = require('../dbClient/ddbClient');
const { TABLE_NAME } = require('../shared/constants');

const getItem = (params) => {
    return ddbClient.get(params).promise();
}

const queryAll = async (params) => {
    let items = [];
    let count = 0;
    const queryResult = await ddbClient.query(params).promise();

    if (queryResult.LastEvaluatedKey) {
        params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
        items = queryResult.Items;
        count += queryResult.Count;
        const nextQueryResult = await queryAll(params);
        items = [...items, ...nextQueryResult.items];
        count += nextQueryResult.itemCount;

        return {
            items,
            itemCount: count
        };
    }

    return {
        items: queryResult.Items,
        itemCount: queryResult.Count
    };
};

const scanAll = async (params) => {
    let items = [];
    let count = 0;
    const scannedResult = await ddbClient.scan(params).promise();

    if (scannedResult.LastEvaluatedKey) {
        params.ExclusiveStartKey = scannedResult.LastEvaluatedKey;
        items = scannedResult.Items;
        count += scannedResult.Count;
        const nextScannedResult = await scanAll(params);
        items = [...items, ...nextScannedResult.items];
        count += nextScannedResult.itemCount;

        return {
            items,
            itemCount: count
        };
    }

    return {
        items: scannedResult.Items,
        itemCount: scannedResult.Count
    };
}

const deleteItem = async (params) => {
    return ddbClient.delete(params).promise();
}

const putItem = async (params) => {
    return ddbClient.put(params).promise();
}

const updateItem = async (params) => {
    return ddbClient.update(params).promise();
}

const batchWriteItems = async (params, depth = 0) => {
    const response = await ddbClient.batchWrite(params).promise();
    const failedRequestTables = Object.keys(response.UnprocessedItems);

    if (failedRequestTables.length > 0) {
            if (depth === 3) {
                return response.UnprocessedItems[TABLE_NAME];
            }

            const retryParams = {
                RequestItems: {
                    ...response.UnprocessedItems
                }
            };

            setTimeout(() => {
                batchWriteItems(retryParams, depth + 1);
            }, 2 * depth * 1000);
    } else {
        return [];
    }
}

const batchGetItems = async (params) => {
    return ddbClient.batchGet(params).promise();
}

module.exports = {
    getItem,
    queryAll,
    scanAll,
    deleteItem,
    putItem,
    updateItem,
    batchGetItems,
    batchWriteItems
}