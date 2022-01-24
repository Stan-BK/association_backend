const Koa = require('koa')
const koaBody = require('koa-body')

const app = new Koa()

const db = require('./database/index')
const router = require('./routes/index')
db(app).catch(error => console.log('数据库操作失败：', error))

app.use(koaBody())
app.use(router.routes(), router.allowedMethods())
app.listen(3001, () => {
  console.log('server is running on 3001')
})