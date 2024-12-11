const express = require('express');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');

const schema = buildSchema(`
  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }
  input AccountInput {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Mutation {
    createAccount(input: AccountInput): Account
    updateAccount(id: ID!, input: AccountInput): Account
  }
  type Query {
    account: [Account]
  }
`);

const fakeDb = {};

const root = {
  createAccount: ({input}) => {
    //相当与数据库的保存
    fakeDb[input.name] = input;
    //返回保存结果
    return fakeDb[input.name]
  },
  updateAccount: ({id, input}) => {
    //相当与数据库的更新
    fakeDb[id] = Object.assign({}, fakeDb[id], input);
    //返回更新结果
    return fakeDb[id]
  },
  account: () => {
    var arr = [];
    for(const key in fakeDb) {
      arr.push(fakeDb[key]);
    }
    return arr;
  }
};

const app = express();

const middleware = (req, res, next) => {

    if(req.url.indexOf('/graphql') > -1 && req.headers.cookie.indexOf('auth') === -1) {
        res.send(JSON.stringify({
            error: "您没有权限访问该页面"
        }))
        return;
    }
    next();
}

app.use(middleware);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.listen(4000);