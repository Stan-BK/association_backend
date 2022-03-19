const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { splitToken, validate } = require('../src/user/user')

// 获取评论
router.get('/comment', async (ctx) => {
  const operate = ctx.db.operate
  const model = ctx.db.model
  const { topic_id, topic_type } = ctx.request.query
  try {
    const content = await operate['Select']('comment', null, {
      topic_type: topic_type,
      topic_id: topic_id
    }, null, model['user'])
    ctx.body = new ResModel().succeed(content)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 添加评论
router.put('/comment', async (ctx) => {
  const operate = ctx.db.operate
  const token = ctx.header['authorization']
  const { parent_id, content, topic_id, topic_type } = ctx.request.body
  try {
    await validate(token)
    const { username } = splitToken(token)
    let { user_id } = await operate['SelectOne']('user', {
      username
    })
    if (content.length > 100) {
      throw new Error('评论最多为100字')
    }
    if (topic_type !== 'announcement' && topic_type !== 'article') {
      throw new Error('评论类型有误')
    }
    const topic = await operate['SelectOne'](topic_type, {
      [topic_type + '_id']: topic_id
    })
    if (topic === String(null)) {
      throw new Error('评论对象不存在')
    }
    const comment = await operate['Insert']('comment', {
      topic_type: topic_type,
      topic_id: topic_id,
      parent_id,
      content: content,
      userUserId: user_id
    })
    ctx.body = new ResModel().succeed(undefined, '评论成功')
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 删除评论
router.delete('/comment', async (ctx) => {
  const operate = ctx.db.operate
  const token = ctx.header['authorization']
  const { comment_id } = ctx.request.query
  try {
    await validate(token)
    const { username } = splitToken(token)
    let { user_id } = await operate['SelectOne']('user', {
      username
    })
    const comment = await operate['SelectOne']('comment', {
      comment_id
    })
    if (comment === String(null)) {
      throw new Error('未找到相关评论')
    }
    if (comment.userUserId != user_id) {
      throw new Error('删除评论失败')
    }
    await operate['Delete']('comment', {
      comment_id
    })
    ctx.body = new ResModel().succeed(undefined, '删除评论成功')
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router