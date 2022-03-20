const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { splitToken, validate } = require('../src/user/user')

router.get('/notice', async (ctx) => {
  const { user_id } = ctx.request.query
  const operate = ctx.db.operate
  const model = ctx.db.model
  try {    
    const token = ctx.header['authorization']
    await validate(token)
    const notice = await operate['Select']('notice', undefined, {
      notice_to: [String(user_id), 'all']
    })
    let origin
    if (notice.notice_type === 'comment') {
      origin = await operate['Select']('comment', undefined, {
        comment_id: notice.notice_from
      }, undefined, model['user'])
    } else {
      origin = await operate['SelectOne']('user', {
        user_id: notice.notice_from
      })
    }
    notice.from = origin
    ctx.body = new ResModel().succeed(notice)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

router.post('/notice', async (ctx) => {
  const { sum, notice_sum } = ctx.request.query
  const operate = ctx.db.operate
  try {
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    await operate['Update']('user', {
      notice_sum: Number(notice_sum) + Number(sum)
    }, {
      username: username
    })
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router