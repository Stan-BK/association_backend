const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')

router.get('/comment/:name?', async (ctx) => {
  const operate = ctx.db.operate
  const topic = ctx.params
  const content = await new ResModel().succeed(operate['Select']('comment', null, {
    topic_type: topic.topicType,
    topic_id: topic.topicId
  }))
  ctx.body = new ResModel().succeed(content)
})

module.exports = router