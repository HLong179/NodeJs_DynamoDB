const AWS = require('aws-sdk');

const REGION = 'us-west-2';

AWS.config.update({region: REGION});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Create the DynamoDB document client
const ddbClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

module.exports = {ddb, ddbClient};