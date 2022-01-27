const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
const { generateToken } = require('../src/user/user')

router.post('/user/login', async (ctx) => {
  const operate = ctx.db.operate
  const user = ctx.request.body
  const isKeepAlive = user.isKeepAlive
  try {
    const data = await operate['Select']('user', null, { 
      username: user.username 
    })
    if (data.length === 0) {
      ctx.body = new resModel().err(undefined, '该用户不存在')
    } else {
      const time = isKeepAlive 
                    ? Date.now() + 30 * 24 * 60 * 60 * 1000
                    : Date.now() + 24 * 60 * 60 * 1000
      const token = await generateToken(user.password)
      await operate['Update']('user', { 
        token: token, 
        time: time 
      }, { 
        username: user.username 
      })
      ctx.body = new resModel()
    }
  } catch(e) {
    console.log(e)
    ctx.body = new resModel().err(undefined, e)
  }
  // const content = await new resModel().succeed(operate['Select']('association'))
  // ctx.body = new resModel().succeed(content)
})

router.get('/user/info', async (ctx) => {
  const operate = ctx.db.operate
  const name = ctx.querystring.split('=')[1]
  const content = await operate['Select']('user', [
    'nickname',
    'avatar',
    'user_role',
    'user_id',
    'article_collect',
    'announcement_collect'
  ], {
    username: name
  })
  ctx.body = new resModel().succeed(content)
})

module.exports = router