'use strict';
const loader = require('./sequelize_loader');
const Sequelize = loader.Sequelize;

const UsersDB = loader.database.define('Users', {
  UserId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reflesh_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tokens: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  jwt_token: {
    type: Sequelize.STRING,
    allowNull: true
  }

},
{
  freezeTableName: true,
});

UsersDB.sync({force: false, alter: true});;
module.exports =UsersDB;