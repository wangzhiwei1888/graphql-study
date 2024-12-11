const express = require('express');
const { buildSchema } = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const mysql = require('mysql2');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',
  password : 'Jason@#123',
  database : 'dashen'
});
 
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});


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
    deleteAccount(id: ID!): Boolean
  }
  type Query {
    account: [Account]
  }
`);

const fakeDb = {};

const root = {
  createAccount: ({input}) => {
    
    const data = [
      input.name,
      input.age,
      input.sex,
      input.department
    ]

    return new Promise((resolve, reject) => {
      
      connection.query('INSERT INTO `account`(`name`,`age`,`sex`,`department`) VALUES(?,?,?,?)',data,function (error, results, fields) {
        if (error) {
          console.log(error);
          return;
        };
        console.log('The solution is: ', results);
        resolve(input);
      });

    });
    


  },
  updateAccount: ({id, input}) => {
    const setClause = Object.keys(input).map(key => `${key} = ?`).join(', ');
    const values = Object.values(input).concat(id);

    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE \`account\` SET ${setClause} WHERE \`name\` = ?`,
        values,
        function (error, results, fields) {
          if (error) {
            console.log(error);
            return reject(error);
          }
          console.log('The solution is: ', results);
          resolve({ ...input, id }); // 返回更新的数据，并保留 ID
        }
      );
    });
  },
  deleteAccount: ({id}) => {

    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM `account` WHERE name = ?',id,function (error, results, fields) {
        if (error) {
          console.log(error);
          return;
        };
        console.log('The solution is: ', results);
        resolve(true);
      })
    })
  },

  account: () => {
    // var arr = [];
    // for(const key in fakeDb) {
    //   arr.push(fakeDb[key]);
    // }
    // return arr;

    return new Promise((resolve, reject) => {
      connection.query('SELECT name, age, sex, department FROM `account`',function (error, results, fields) {
        if (error) {
          console.log(error);
          return;
        };
        console.log('The solution is: ', results);

        const arr = [];
        for(let i = 0; i < results.length; i++) {
          arr.push({
            name: results[i].name,
            age: results[i].age,
            sex: results[i].sex,
            department: results[i].department
          });
        }
        resolve(arr);
      });
    });


  }
};

const app = express();


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.listen(4000);