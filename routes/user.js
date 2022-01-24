const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
// const koaBody = require('koa-body')

router.post('/user/login', async (ctx) => {
  const operate = ctx.db.operate
  const user = ctx.request.body
  // const content = await new resModel().succeed(operate['Select']('association'))
  // ctx.body = new resModel().succeed(content)
})

router.get('/user/info', async (ctx) => {
  const operate = ctx.db.operate
  const name = ctx.params.name
  // const content = await new resModel().succeed(operate['Select']('user', null, {
  //   name
  // }))
  // ctx.body = new resModel().succeed(content)
})

module.exports = router