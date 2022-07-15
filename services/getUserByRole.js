const {ddbClient} = require('../dbClient/ddbClient');
const { TABLE_NAME, GSI } = require('../shared/constants');

const getUserByRole = (role) => {
    const params = {
        TableName: TABLE_NAME,
        IndexName: GSI,
        ExpressionAttributeValues: {
            ':role': role
        },
        ExpressionAttributeNames: {
            '#r': 'role'
        },
        KeyConditionExpression: '#r = :role'
    }

    return ddbClient.query(params).promise();
}

const getUserByRoleAndGender = (role, gender) => {
    const params = {
        TableName: TABLE_NAME,
        IndexName: GSI,
        ExpressionAttributeValues: {
            ':role': role,
            ':gender': gender
        },
        ExpressionAttributeNames: {
            '#r': 'role'
        },
        KeyConditionExpression: '#r = :role and gender = :gender'
    }

    return ddbClient.query(params).promise();
}

module.exports = {getUserByRole, getUserByRoleAndGender};