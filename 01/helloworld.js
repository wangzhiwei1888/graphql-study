const express = require('express');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');

const schema = buildSchema(`
  type Account {
    name: String
    age: Int,
    sex: String,
    department: String
  }
  type Query {
    hello: String,
    accountName: String,
    age: Int,
    account: Account
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
  accountName: () => {
    return 'Account Name';
  },
  age: () => {
    return 30;
  },
  account: () => {
    return {
      name: 'Account Name',
      age: 30,
      sex: 'Male',
      department: 'IT'
    }
  }
};

const app = express();


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.listen(4000);