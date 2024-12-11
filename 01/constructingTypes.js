const express = require('express');
const graphql = require('graphql');
const {graphqlHTTP} = require('express-graphql');


const { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLSchema } = graphql;

var AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    sex: { type: GraphQLString },
    department: { type: GraphQLString }
  }
});


var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    account: {
      type: AccountType,
      args: {
        username: { type: GraphQLString }
      },
      resolve: function (_, { username }) {
        return {
          name: username,
          age: 30,
          sex: 'Male',
          department: 'IT'
       }
      }
    }
  }
})


var schema = new GraphQLSchema({ query: queryType });




const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));
  
  
  app.listen(4000);