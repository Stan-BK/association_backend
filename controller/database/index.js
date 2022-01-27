const { defineSequelizeModel } = require('./model')
const { testDatabaseConnect } = require('./connection')

const { Sequelize, DataTypes } = require('sequelize')
const { config } = require('./database.config')
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  define: {
    freezeTableName: true
  }
})

async function db(app) {
  await testDatabaseConnect(sequelize) 
  app.context.db = {}
  app.context.db.model = defineSequelizeModel(sequelize, DataTypes)
  app.context.db.operate = require('./operate')(app.context.db.model) // 传入数据表模型，获得CRUD操作对象
}

module.exports = db