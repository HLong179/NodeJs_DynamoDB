const { User } = require('../models/user');
const { CUSTOMER_ID, TABLE_NAME, GSI } = require('../shared/constants');
const {queryAll, getItem, scanAll, putItem, deleteItem, batchWriteItems, batchGetItems, updateItem} = require('./dynamodb');

class UserServices {
    queryAllUsersByCustomerId (customerId, limit = 20) {
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

    async updateUserInfo (updatedData) {
        const {
            Item: {
                first_name, 
                last_name, 
                role: currentRole,
                gender: currentGender,
                age: currentAge,
                address: currentAddress,
                password: currentPassword
            }
        } = await this.getUserByCustomerIdAndEmail(updatedData.customerId, updatedData.email);

        const {
            email,
            customerId,
            firstName = first_name,
            lastName = last_name,
            role = currentRole,
            gender = currentGender,
            age = currentAge,
            address = currentAddress,
            password = currentPassword
        } = updatedData;

        const params = {
            TableName: TABLE_NAME,
            Key: {
                pk: `CUSTOMER_ID::${customerId}`,
                sk: `EMAIL::${email}`,
            },
            UpdateExpression: `
                set first_name = :firstName,
                last_name = :lastName,
                #r = :role,
                meta_data = :metadata,
                gender = :gender,
                password = :password
            `,
            // Because role is a reversed word so we need to specify it in the ExpressionAttributeNames
            ExpressionAttributeNames: {
                '#r': 'role'
            },
            ExpressionAttributeValues: {
                ':firstName': firstName || currentUserInfo.first_name,
                ':lastName': lastName || currentUserInfo.last_name,
                ':role': role || currentUserInfo.role,
                ':metadata': {
                    age,
                    address
                },
                ':gender': gender,
                ':password': password
            },
            ReturnValues: 'ALL_NEW'
        }

        return updateItem(params);
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
    
    deleteUserByCustomerIdAndEmail (customerId, email) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                pk: `CUSTOMER_ID::${customerId}`,
                sk: `EMAIL::${email}`,
            },
            ReturnValues: 'ALL_OLD'
        };
    
        return deleteItem(params);
    }
    
    generateBatchUsersData (startIndex, count) {
        const users = [];
        for (let index = startIndex; index < startIndex + count; index++) {
            const userEmail = `dilenaza${index}@gmail.com`;
            
            users.push(new User(
                `CUSTOMER_ID::${CUSTOMER_ID}`,
                `EMAIL::${userEmail}`,
                `Dil${index}`,
                `Ladaneya${index}`,
                'Signer',
                'female',
                userEmail,
                `111${index}`,
                {
                    age: index,
                    address: 'Voldam'
                }
            ));
        }
    
        return users;
    }
    
    async batchWriteUsers (startIndex, count) {
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
                },
            }
        });

        const params = {
            RequestItems: {
                [TABLE_NAME]: requestParams
            },
            ReturnItemCollectionMetrics: 'SIZE'
        };
        const unprocessedItems = await batchWriteItems(params);

        if (unprocessedItems && unprocessedItems.length > 0) {
            const failedPutRequestItems = unprocessedItems.filter(item => item.PutRequest);
            const failedPutRequestItemsSK = failedPutRequestItems.map(item => item.PutRequest.Item.sk);

            return {
                success: batchUserData.filter(userData => !failedPutRequestItemsSK.includes(userData.sk)),
                failed: failedPutRequestItems.map(({PutRequest: {Item : {pk, sk}}}) => ({pk, sk}))
            }
        }

        return {
            success: batchUserData.map(({pk, sk}) => ({pk, sk}))
        }
    }
    
    batchReadUsers (customerId, emails) {
        const Keys = emails.map(email => {
            return {
                pk: `CUSTOMER_ID::${customerId}`,
                sk: `EMAIL::${email}`
            }
        });
        const params = {
            RequestItems: {
                [TABLE_NAME]: {
                    Keys
                }
            }
        };
    
        return batchGetItems(params);
    }

    generateBatchDeleteUserParams (customerId, emails) {
        return emails.map(email => {
            return {
                DeleteRequest: {
                    Key: {
                        pk: `CUSTOMER_ID::${customerId}`,
                        sk: `EMAIL::${email}`,
                    }
                }
            };
        });
    }
    
    async batchDeleteUsers (customerId, emails) {
        const batchDeleteParams = this.generateBatchDeleteUserParams(customerId, emails);
        const params = {
            RequestItems: {
                [TABLE_NAME]: batchDeleteParams
            },
            ReturnConsumedCapacity: 'INDEXES'
        };
        const unprocessedItems = await batchWriteItems(params);

        if (!unprocessedItems || unprocessedItems.length === 0) {
            return {
                success: batchDeleteParams.map(requestParam => requestParam.DeleteRequest.Key)
            }
        }

        const failedDeleteRequestItems = unprocessedItems.filter(item => item.DeleteRequest).map(item => item.DeleteRequest.Key);
        const failedDeletedRequestItemSKs = failedDeleteRequestItems.map(item => item.sk);

        return {
            failed: failedDeleteRequestItems,
            success: batchDeleteParams.filter(item => !failedDeletedRequestItemSKs.includes(item.DeleteRequest.Key.sk)).map(item => item.DeleteRequest.Key)
        }
    };
    
    async addNewUser (user) {
        const params = {
            TableName: TABLE_NAME,
            Item: {
              pk: `CUSTOMER_ID::${user.customerId}`,
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
        
        try {
            await putItem(params);
            return params.Item;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = {
    UserServices
};