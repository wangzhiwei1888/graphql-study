const express = require('express');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');

//!为必须参数
const schema = buildSchema(`
  
  type Account {
    name: String
    age: Int
    sex: String
    department: String
    salary(city: String): Int
  }
  type Query {
    getClassMates(classNum: Int!):[String]
    account(username: String): Account
  }
`);

const root = {
  getClassMates: ({classNum}) => {
    const obj = {
        1: ['Jack', 'Rose', 'Lucy'],
        2: ['Tom', 'Jerry', 'Mike']
    }

    return obj[classNum];
  },
  account: ({username}) => {
    const name = username;
    const sex = 'Male';
    const age = 30;
    const department = 'IT';
    const salary = ({city}) => {
      return city === '北京' ? 10000 : 4000;
    }
    return {name, sex, age, department, salary};
  }
};

const app = express();


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


//静态资源目录
app.use(express.static('public'));

app.listen(4000);