const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
const { splitToken, validate } = require('../src/user/user')

// 返回所有公告列表
router.get('/announcement', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('announcement', ['announcement_id', 'name', 'avatar', 'abstract', 'association_id'], {
    name: '测试公告',
  }, undefined, model.association)
  
  ctx.body = new resModel().succeed(content.splice(count, 6))
})

// 返回用户公告收藏列表
router.get('/announcement/collect', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    let collection = await operate['Select']('user', ['announcement_collect'], { username: username })
    if (collection.length) {
      collection = collection[0]['announcement_collect'].split(',')
      const content = await operate['Select']('announcement', ['announcement_id', 'name', 'avatar', 'abstract', 'association_id'], {
        announcement_id: collection
      }, undefined, model.association)
      ctx.body = new resModel().succeed(content)
    } else {
      ctx.body = new resModel().success([])
    }
  } catch(e) {
    console.log(e)
    ctx.body = new resModel().err(undefined, e)
  }
})

// 返回指定公告
router.get('/announcement/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const announcement_id = ctx.params.id
  const content = await operate['Select']('announcement', null, {
    announcement_id: announcement_id
  }, undefined, model.association)

  ctx.body = new resModel().succeed(content)
})


module.exports = router