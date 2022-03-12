const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { generateToken, validate } = require('../src/user/user')
const generateError = require('../src/error')

router.post('/user/login', async (ctx) => {
  const operate = ctx.db.operate
  const user = ctx.request.body
  const isKeepAlive = user.isKeepAlive
  if (user.username === '' || user.password === '') {
    ctx.body = new ResModel().err(undefined, '用户名和密码不能为空')
    return
  }
  try {
    const data = await operate['Select']('user', null, { 
      username: user.username 
    })
    if (data.length === 0 || data[0].password !== user.password) {
      ctx.body = new ResModel().err(undefined, '用户名或密码错误')
    } else {
      const token = await generateToken(user.username, isKeepAlive) // 根据用户名生成token
      ctx.body = new ResModel().succeed(token) // 返回token给用户
    }
  } catch(e) {
    console.log(e)
    ctx.body = new ResModel().err(undefined, e)
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
    ctx.body = new ResModel().succeed(content)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e)
  }
})

router.put('/user/register', async (ctx, next) => {
  const operate = ctx.db.operate
  const user = ctx.request.body
  try {
    await operate['Insert']('user', {
      avatar: user.avatar,
      username: user.username,
      password: user.password,
      nickname: user.nickname,
      user_role: 1
    })
    const token = await generateToken(user.username, false) // 根据用户名生成token
    ctx.body = new ResModel().succeed(token)
  } catch(e) {
    let error = generateError(e)
    const obj = {
      'username': '用户名',
      'nickname': '昵称'
    }
    const field = obj[error.split(' ')[0]]
    error = field + '已存在'
    ctx.body = new ResModel().err(undefined, error)
  }
})

module.exports = router