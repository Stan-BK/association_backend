const { defineSequelizeModel } = require('./model')
const { testDatabaseConnect } = require('./connection')

async function db(sequelize, DataTypes) {
  const model = defineSequelizeModel(sequelize, DataTypes)
  await testDatabaseConnect(sequelize) 
}

module.exports = db