'use strict';
const loader = require('./sequelize_loader');
const Sequelize = loader.Sequelize;

const IdListDB = loader.database.define('IdLists', {
  GoogleUserId: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  StudentOrTeacher: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
  {
  freezeTableName: true,
});

IdListDB.sync({force: false, alter: true});;
module.exports = IdListDB;