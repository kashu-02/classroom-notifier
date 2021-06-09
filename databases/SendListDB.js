'use strict';
const loader = require('./sequelize_loader');
const Sequelize = loader.Sequelize;

const SendListDB = loader.database.define('SendLists', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  SendEmail: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Classname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ClassId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  LastUpdate: {
    type: Sequelize.DATE,
    allowNull: true
  }

},
{
  freezeTableName: true,
});

const UsersDB = require('./UsersDB')

SendListDB.sync({force: false, alter: true}).then(() => {
  SendListDB.belongsTo(UsersDB, {
    foreignKey: 'UserId',
    targetKey: 'UserId'}
  );
});

module.exports =SendListDB;