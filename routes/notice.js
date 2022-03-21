const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { splitToken, validate } = require('../src/user/user')

router.get('/notice', async (ctx) => {
  const operate = ctx.db.operate
  const model = ctx.db.model
  try {    
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    const { user_id, notice_sum } = await operate['SelectOne']('user', {
      username
    })
    const notice = await operate['Select']('notice', undefined, {
      notice_to: [String(user_id), 'all']
    })
    const noticeNum = notice_sum ? notice_sum.split(',').length : 0
    const hasNewNotice = notice.length > noticeNum ? true : false
    for (var n of notice) {
      let origin
      if (n.notice_type === 'comment') {
        origin = await operate['Select']('comment', undefined, {
          comment_id: n.notice_from
        }, undefined, model['user'])
        origin = origin[0]
      } else {
        origin = await operate['SelectOne']('user', {
          user_id: n.notice_from
        })
      }
      n.dataValues.from = origin
    }
    ctx.body = new ResModel().succeed({
      notice,
      notice_sum,
      hasNewNotice
    })
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

router.post('/notice', async (ctx) => {
  const { notice_sum } = ctx.request.query
  const operate = ctx.db.operate
  try {
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    await operate['Update']('user', {
      notice_sum: notice_sum
    }, {
      username: username
    })
    ctx.body = new ResModel().succeed(undefined, '标记为已读')
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

router.delete('/notice', async (ctx) => {
  const { notice_id } = ctx.request.query
  const operate = ctx.db.operate
  try {
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    await operate['Delete']('notice', {
      notice_id
    })
    const { notice_sum } = await operate['SelectOne']('user', {
      username
    })
    let new_notice_sum = new Set(notice_sum.split(','))
    new_notice_sum.delete(String(notice_id))
    new_notice_sum = Array.from(new_notice_sum).join(',')
    await operate['Update']('user', {
      notice_sum: new_notice_sum
    }, {
      username
    })
    ctx.body = new ResModel().succeed(new_notice_sum, '删除消息通知成功')
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router