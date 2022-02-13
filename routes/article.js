const Router = require('koa-router')
const router = new Router()
const resModel = require('../controller/index')
const { splitToken, validate } = require('../src/user/user')

// 返回所有文章列表
router.get('/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'association_id'], {
    name: '测试文章',
  }, undefined, model.association)
  
  ctx.body = new resModel().succeed(content.splice(count, 6))
})

// 返回用户文章收藏列表
router.get('/article/collect', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    let collection = await operate['Select']('user', ['article_collect'], { username: username })
    if (collection.length) {
      collection = collection[0]['article_collect'].split(',')
      const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'association_id'], {
        article_id: collection
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

// 返回指定文章
router.get('/article/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const article_id = ctx.params.id
  let content = await operate['Select']('article', null, {
    article_id
  }, undefined, model.association)
  
  ctx.body = new resModel().succeed(content)
})

module.exports = router