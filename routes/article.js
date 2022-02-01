const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')

router.get('/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'association_id'], {
    name: '测试文章',
  }, undefined, model.association)
  
  ctx.body = new resModel().succeed(content)
})

router.get('/article/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const article_id = ctx.params.id
  let content = await operate['Select']('article', null, {
    article_id
  }, undefined, model.association)
  ctx.body = new resModel().succeed(content)
})

module.exports = router