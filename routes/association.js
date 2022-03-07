const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')

router.get('/association', async (ctx) => {
  const operate = ctx.db.operate
  const content = await new ResModel().succeed(operate['Select']('association'))
  ctx.body = new ResModel().succeed(content)
})

router.get('/association/list', async (ctx) => {
  const operate = ctx.db.operate
  const model = ctx.db.model
  const content = await operate['Select']('association', ['name', 'path'])
  ctx.body = new ResModel().succeed(content)
})

router.get('/association/:name?', async (ctx) => {
  const operate = ctx.db.operate
  const name = ctx.params.name
  const content = await new ResModel().succeed(operate['Select']('association', null, {
    name
  }))
  ctx.body = new ResModel().succeed(content)
})

module.exports = router