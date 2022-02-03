const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
const { generateToken, validate } = require('../src/user/user')

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
      const token = await generateToken(user.username, isKeepAlive) // 根据用户名生成token
      await operate['Update']('user', { 
        token: token
      }, { 
        username: user.username 
      })
      ctx.body = new resModel().succeed(token) // 返回token给用户
    }
  } catch(e) {
    console.log(e)
    ctx.body = new resModel().err(undefined, e)
  }
})

router.get('/user/info', async (ctx) => {
  const operate = ctx.db.operate
  try {
    await validate(ctx.header['authorization'])
    // 解码得出用户名以进行数据查询
    const username = Buffer.from(ctx.header['authorization'].split(':')[0], 'base64').toString('utf-8')
    const content = await operate['Select']('user', [
      'nickname',
      'avatar',
      'user_role',
      'user_id',
      'article_collect',
      'announcement_collect'
    ], {
      username: username
    })
    ctx.body = new resModel().succeed(content)
  } catch(e) {
    ctx.body = new resModel().err(e)
  }
})

module.exports = router