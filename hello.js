const {buildSchema} = require('graphql');
const express = require('express');
const {graphqlHTTP} = require('express-graphql');


// construct the schema using GraphQL schema language
const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

// The rootValue provides a resolver function for each API endpoint
const rootValue = { hello: () => 'Hello world!'};

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}));

app.listen(4000);
console.log('Server is running at port 4000');


// // Run the GraphQL query and print the response
// graphql({schema, source, rootValue}).then((res) => {
//     console.log('response from graphQL: ', res);
// });
