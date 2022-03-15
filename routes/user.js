const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { generateToken, validate } = require('../src/user/user')
const generateError = require('../src/error')

// 生成初始随机昵称的备用字符
const strUpc = Array(26).fill(65).map((num, index) => String.fromCodePoint(num + index))
const strLwc = Array(26).fill(97).map((num, index) => String.fromCodePoint(num + index))
const strNum = Array(10).fill(0).map((num, index) => num + index)

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
  const model = ctx.db.model
  try {
    await validate(ctx.header['authorization'])
    // 解码得出用户名以进行数据查询
    const username = Buffer.from(ctx.header['authorization'].split(':')[0], 'base64').toString('utf-8')
    const content = await operate['SelectOne']('user', {
      username: username
    }, model['association'])
    ctx.body = new ResModel().succeed(content)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e)
  }
})

router.post('/user/register', async (ctx) => {
  const operate = ctx.db.operate
  const user = ctx.request.body
  try {
    if (user.username === '' || user.password === '') {
      throw new Error('用户名和密码不能为空')
    }
    if (user.password !== user.confirmpwd) {
      throw new Error('两次密码输入不一致')
    }
    await operate['Insert']('user', {
      username: user.username,
      password: user.password,
      nickname: generateRandomNickname()
    })
    const token = await generateToken(user.username, false) // 根据用户名生成token
    ctx.body = new ResModel().succeed(token)
  } catch(e) {
    console.log(e)
    let error = generateError(e)
    ctx.body = new ResModel().err(undefined, error)
  }

  function generateRandomNickname() {
    const str = Array.from({ length: 8 }).map(() => strUpc.concat(strLwc, strNum)[Math.floor(Math.random() * (26 + 26 + 10))]).join('')
    return 'ank_' + str
  }
})

module.exports = router