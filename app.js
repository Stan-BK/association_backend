const Koa = require('koa')
const app = new Koa()
const { config } = require('./database/database.config')
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  define: {
    freezeTableName: true
  }
})
const { defineSequelizeModel } = require('./database/model')
const model = defineSequelizeModel(sequelize, DataTypes)
const { testDatabaseConnect } = require('./database/connection')
testDatabaseConnect(sequelize)



app.use(async ctx => {
  ctx.body = 'Hello koa!!!'
})
app.listen(3001)