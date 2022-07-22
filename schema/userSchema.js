module.exports = `
    input UserInput {
        customerId: String!,
        firstName: String
        lastName: String
        role: String
        gender: String
        email: String!
        password: String
        age: Int
        address: String
    }

    type Metadata {
        age: Int
        address: String
    }

    type User {
        pk: String!
        sk: String!
        first_name: String
        last_name: String
        role: String
        gender: String
        email: String!
        password: String
        meta_data: Metadata
    }

    type CompositeKey {
        pk: String!,
        sk: String!
    }

    type BatchWriteUsersResponse {
        success: [CompositeKey],
        failed: [CompositeKey]
    }

    type Query {
        users: [User]
        user_by_customerId_and_email(customerId: String!, email: String!): User,
        users_by_customerId(customerId: String!): [User],
        users_by_role(role: String!): [User],
        users_by_role_and_gender(role: String, gender: String): [User],
        batch_get_users(customerId: String!, emails: [String]!): [User]
    }

    type Mutation {
        create_user(user: UserInput!): User
        create_users(startIndex: Int!, count: Int!): BatchWriteUsersResponse
        update_user(user: UserInput!): User
        delete_user(customerId: String!, email: String!): User
        delete_users(customerId: String!, emails: [String]!): BatchWriteUsersResponse
    }
`
