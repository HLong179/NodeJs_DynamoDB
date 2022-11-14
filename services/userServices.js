const { User } = require('../models/user');
const { CUSTOMER_ID, TABLE_NAME, GSI } = require('../shared/constants');
const {queryAll, getItem, scanAll, putItem, deleteItem, batchWriteItems, batchGetItems} = require('./dynamodb');

class UserServices {
    queryAllUsersByCustomerId () {
        const params = {
            TableName: TABLE_NAME,
            ExpressionAttributeValues: {
                ':customerId': `CUSTOMER_ID::${customerId}`
            },
            KeyConditionExpression: 'pk = :customerId',
            Limit: limit
        };
    
        return queryAll(params);
    }

    getUserByCustomerIdAndEmail (customerId, email) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                pk: `CUSTOMER_ID::${customerId}`,
                sk: `EMAIL::${email}`
            }
        };
    
        return getItem(params);
    }

    scanUserTable () {
        const params = {
            TableName: TABLE_NAME,
            Limit: 20
        };
        return scanAll(params);
    }

    updateUserInfo (updatedData) {
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
        return putItem(params);
    }
    
    getUserByRole (role, limit = 20) {
        const params = {
            TableName: TABLE_NAME,
            IndexName: GSI,
            ExpressionAttributeValues: {
                ':role': role
            },
            ExpressionAttributeNames: {
                '#r': 'role'
            },
            KeyConditionExpression: '#r = :role',
            Limit: limit
        }
    
        return queryAll(params);
    }
    
    getUserByRoleAndGender (role, gender, limit = 20) {
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
            KeyConditionExpression: '#r = :role and gender = :gender',
            Limit: limit
        }
    
        return queryAll(params);
    }
    
    deleteUserByEmail (email) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                pk: `CUSTOMER_ID::${CUSTOMER_ID}`,
                sk: `EMAIL::${email}`,
            }
        };
    
        return deleteItem(params);
    }
    
    generateBatchUsersData (startIndex, count) {
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
    
    batchWriteUsers (startIndex, count) {
        const batchUserData = this.generateBatchUsersData(startIndex, count);
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
    
        return batchWriteItems(params);
    }
    
    batchReadUsers () {
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
    
        return batchGetItems(params);
    }

    generateBatchDeleteUserParams (emails) {
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
    
    async batchDeleteUsers (emails) {
        const params = {
            RequestItems: {
                [TABLE_NAME]: this.generateBatchDeleteUserParams(emails)
            }
        };
    
        return batchWriteItems(params);
    };
    
    addNewUser (user) {
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
        
        return putItem(params);
    }
}

module.exports = {
    UserServices
};