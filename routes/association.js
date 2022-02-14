const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')

router.get('/association', async (ctx) => {
  const operate = ctx.db.operate
  const content = await new resModel().succeed(operate['Select']('association'))
  ctx.body = new resModel().succeed(content)
})

router.get('/association/list', async (ctx) => {
  const operate = ctx.db.operate
  const model = ctx.db.model
  const content = await operate['Select']('association', ['name', 'path'])
  ctx.body = new resModel().succeed(content)
})

router.get('/association/:name?', async (ctx) => {
  const operate = ctx.db.operate
  const name = ctx.params.name
  const content = await new resModel().succeed(operate['Select']('association', null, {
    name
  }))
  ctx.body = new resModel().succeed(content)
})

module.exports = router