const {buildSchema} = require('graphql');
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const userSchema = require('./schema/userSchema');
const {userResolvers} = require('./resolvers/userResolver');


// construct the schema using GraphQL schema language
const schema = buildSchema(userSchema);

// The rootValue provides a resolver function for each API endpoint
const rootValue = {
   ...userResolvers
};

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}));

app.listen(4000);
console.log('Server is running at port 4000');