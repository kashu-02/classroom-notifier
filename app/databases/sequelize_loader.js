'use strict';
require('dotenv').config()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
      operatorsAliases: true,
      logging: false,
    });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
