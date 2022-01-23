const Koa = require('koa')
const app = new Koa()

const { Sequelize, DataTypes } = require('sequelize')
const { config } = require('./database/database.config')
const db = require('./database/index')
const router = require('./routes/index')

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  define: {
    freezeTableName: true
  }
})
let model // 接收sequelize模型

db(sequelize, DataTypes).then(data => {
  model = data
  const operate = require('./database/operate')(model) // 传入数据表模型，获得CRUD操作对象
  app.use(router.routes(), router.allowedMethods())
  app.listen(3001)

}).catch(error => {
  console.log('数据库同步出错:', error)
})