const Koa = require('koa')
const app = new Koa()
const { config } = require('./database/database.config')
const { Sequelize, DataTypes } = require('sequelize')
const db = require('./database/index')
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  define: {
    freezeTableName: true
  }
})

db(sequelize, DataTypes).then(() => {
  app.listen(3001)
}).catch(err => {
  console.log('数据库同步出错:', error)
})