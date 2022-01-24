const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')

router.get('/announcement', async (ctx) => {
  const operate = ctx.db.operate
  const content = await operate['Select']('announcement')
  ctx.body = new resModel().succeed(content)
})

router.get('/announcement/:id?', async (ctx) => {
  const operate = ctx.db.operate
  const announcement_id = ctx.params.id
  const content = await operate['Select']('announcement', null, {
    announcement_id: announcement_id
  })
  ctx.body = new resModel().succeed(content)
})

module.exports = router