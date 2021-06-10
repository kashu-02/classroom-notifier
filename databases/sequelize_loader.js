'use strict';
require('dotenv').config()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let sequelize

if(process.env.NODE_ENV == "development"){
 sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
      operatorsAliases: true,
      logging: false,
    })
}else{
 sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    operatorsAliases: true,
    logging: false,
    dialectOptions: {
      useUTC: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
}

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
