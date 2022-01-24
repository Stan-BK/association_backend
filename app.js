const Koa = require('koa')
const app = new Koa()

const db = require('./database/index')
const router = require('./routes/index')
db(app).catch(error => console.log('数据库操作失败：', error))


app.use(router.routes(), router.allowedMethods())
app.listen(3001, () => {
  console.log('server is running on 3001')
})