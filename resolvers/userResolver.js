const {UserServices} = require('../services/userServices');
const { TABLE_NAME } = require('../shared/constants');

const userResolvers = {
    users: async () => {
        return (await new UserServices().scanUserTable()).items;
    },
    users_by_customerId: async ({customerId}) => {
        const data = await new UserServices().queryAllUsersByCustomerId(customerId);
        
        return data.items;
    },
    user_by_customerId_and_email: async ({customerId, email}) => {
        const {Item} = await new UserServices().getUserByCustomerIdAndEmail(customerId, email);
        
        return Item;
    },
    users_by_role: async ({role}) => {
        const data = await new UserServices().getUserByRole(role);

        return data.items;
    },
    users_by_role_and_gender: async ({role, gender}) => {
        const data = await new UserServices().getUserByRoleAndGender(role, gender);

        return data.items;
    },
    create_user: async ({user}) => {
       try {
        const data =  await new UserServices().addNewUser(user);

        return data;
       } catch (error) {
        return error;
       }
    },
    create_users: async ({startIndex, count}) => {
        try {
            const response = await new UserServices().batchWriteUsers(startIndex, count);
            return response;
        } catch (error) {
            return error;
        }
    },
    update_user: async ({user}) => {
        try {
            const data =  await new UserServices().updateUserInfo(user);

            return data.Attributes;
        } catch (error) {
        return error;
        }
    },
    delete_user: async ({customerId, email}) => {
        try {
            const {Attributes} = await new UserServices().deleteUserByCustomerIdAndEmail(customerId, email);

            return Attributes;
        } catch (error) {
            
        }
    },
    delete_users: async ({customerId, emails}) => {
        try {
            const response = await new UserServices().batchDeleteUsers(customerId, emails);
            return response;
        } catch (error) {
            return error
        }
    },
    batch_get_users: async ({customerId, emails}) => {
        try {
            const response = await new UserServices().batchReadUsers(customerId, emails);
            return response.Responses[TABLE_NAME];
        } catch (error) {
            return error;
        }
    }
}

module.exports = {userResolvers};