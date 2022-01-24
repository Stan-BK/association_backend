const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')

router.get('/comment/:name?', async (ctx) => {
  const operate = ctx.db.operate
  const topic = ctx.params
  const content = await new resModel().succeed(operate['Select']('comment', null, {
    topic_type: topic.topicType,
    topic_id: topic.topicId
  }))
  ctx.body = new resModel().succeed(content)
})

module.exports = router