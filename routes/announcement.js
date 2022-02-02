const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')

router.get('/announcement', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('announcement', ['announcement_id', 'name', 'avatar', 'abstract', 'association_id'], {
    name: '测试公告',
  }, undefined, model.association)
  
  ctx.body = new resModel().succeed(content.splice(count, 6))
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