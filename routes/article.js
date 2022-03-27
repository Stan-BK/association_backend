const Router = require('koa-router')
const router = new Router()
const ResModel = require('../model/response')
const { validateRole } = require('../src/user/admin')
const { splitToken, validate } = require('../src/user/user')
const { Op } = require('sequelize')

// 添加文章模糊搜索功能
router.get('/article_s', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const { q, detail } = ctx.request.query
  const detailAttrs = ['article_id', 'name', 'avatar', 'abstract', 'associationAssociationId']
  try {
    const content = await operate['Select']('article', detail == 1 ? detailAttrs : ['name'], {
      name: {
        [Op.like]: `%${q }%`
      }
    }, undefined, detail == 1 ? model.association : undefined)
    ctx.body = new ResModel().succeed(content)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 返回所有文章列表
router.get('/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const count = ctx.querystring.split('=')[1]
  const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'associationAssociationId'], undefined , undefined, model.association)
  
  ctx.body = new ResModel().succeed(content.splice(count, count == undefined ? content.length : 6))
})

// 返回用户文章收藏列表
router.get('/article/collect', async (ctx) => {
  try {
    const model = ctx.db.model
    const operate = ctx.db.operate
    const token = ctx.header['authorization']
    await validate(token)
    const { username } = splitToken(token)
    let [{'article_collect': collection}] = await operate['Select']('user', ['article_collect'], { username: username })
    if (collection) {
      collection = collection.split(',')
      const content = await operate['Select']('article', ['article_id', 'name', 'avatar', 'abstract', 'associationAssociationId'], {
        article_id: collection
      }, undefined, model.association)
      ctx.body = new ResModel().succeed(content)
    } else {
      ctx.body = new ResModel().succeed([])
    }
  } catch(e) {
    console.log(e)
    ctx.body = new ResModel().err(undefined, e)
  }
})

// 添加收藏文章
router.put('/article/collect', async (ctx) => {
  const operate = ctx.db.operate
  const token = ctx.header['authorization']
  const { article_id } = ctx.request.query
  console.log(ctx.request.params)
  try {
    await validate(token)
    const { username } = splitToken(token)
    let article = await operate['SelectOne']('article', {
      article_id
    })
    if (article !== String(null)) {
      let [{'article_collect': collection}] = await operate['Select']('user', ['article_collect'], { username: username })
      if (collection) {
        collection = Array.from(new Set(collection.split(',')).add(article_id)).join(',')
        await operate['Update']('user', { 
          'article_collect': collection 
        }, {
          username: username
        })
        ctx.body = new ResModel().succeed(collection, '收藏成功')
      } else {
        await operate['Update']('user', {
          'article_collect': article_id.toString()
        }, {
          username: username
        })
        ctx.body = new ResModel().succeed(article_id.toString(), '收藏成功')
      }
    } else {
      throw new Error('未找到相关文章')
    }
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 删除收藏文章
router.delete('/article/collect', async (ctx) => {
  const operate = ctx.db.operate
  const token = ctx.header['authorization']
  const { article_id } = ctx.request.query
  try {
    await validate(token)
    const { username } = splitToken(token)
    let article = await operate['SelectOne']('article', {
      article_id
    })
    if (article !== String(null)) {
      let [{'article_collect': collection}] = await operate['Select']('user', ['article_collect'], { username: username })
      if (collection) {
        collection = collection.split(',').filter(item => item != article_id).join(',')
        await operate['Update']('user', { 
          'article_collect': collection 
        }, {
          username: username
        })
        ctx.body = new ResModel().succeed(collection, '已取消收藏')
      } else {
        throw new Error('未找到相关收藏')
      }
    } else {
      throw new Error('未找到相关收藏')
    }
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 返回社团文章列表
router.get('/:association/article', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const association = ctx.params.association
  try {
    const content = await operate['SelectOne']('association', {
      path: association
    }, {
      model: model['article'],
      attributes: ['article_id', 'name', 'avatar', 'abstract', 'associationAssociationId']
    })
    const articleAssociation = {}
    for (var key of Reflect.ownKeys(content.dataValues)) {
      if (key !== 'articles') {
        articleAssociation[key] = content[key]
      }
    }
    
    const articles = content.articles.map(item => {
      item.dataValues.association = articleAssociation
      return item
    })
    ctx.body = new ResModel().succeed(articles)
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e)
  }
})

// 返回指定文章
router.get('/article/:id?', async (ctx) => {
  const model = ctx.db.model
  const operate = ctx.db.operate
  const article_id = ctx.params.id
  let content = await operate['SelectOne']('article', {
    article_id
  }, model.association)
  
  ctx.body = new ResModel().succeed(content)
})

// 添加文章
router.put('/article', async (ctx) => {
  const operate = ctx.db.operate
  const article = ctx.request.body
  const token = ctx.header['authorization']
  try {
    if (article.name === '' || !article.association_id) {
      throw new Error('必填字段为空')
    }
    await validate(token)
    const { username } = splitToken(token)
    const admin = await operate['SelectOne']('user', { username: username })
    const res = admin.associationAssociationId == article.association_id
    if (res) {
      await operate['Insert']('article', {
        associationAssociationId: article.association_id,
        name: article.name,
        avatar: article.avatar,
        abstract: article.abstract,
        content: article.content
      })
      ctx.body = new ResModel().succeed(undefined, '添加文章成功')
    } else {
      throw new Error('添加文章失败')
    }
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 修改文章
router.post('/article', async (ctx) => {
  const operate = ctx.db.operate
  const article = ctx.request.body
  const token = ctx.header['authorization']
  try {
    if (article.name === '' || !article.association_id) {
      throw new Error('必填字段为空')
    }
    await validate(token)
    const { username } = splitToken(token)
    const admin = await operate['SelectOne']('user', { username: username })
    const res = admin.associationAssociationId == article.association_id
    if (res) {
      await operate['Update']('article', {
        name: article.name,
        avatar: article.avatar,
        abstract: article.abstract,
        content: article.content
      },{
        article_id: Number(article.article_id),
      })
      ctx.body = new ResModel().succeed(undefined, '修改文章成功')
    } else {
      throw new Error('修改文章失败')
    }
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

// 删除文章
router.delete('/article', async (ctx) => {
  const operate = ctx.db.operate
  const article_id = ctx.querystring.split('=')[0] === 'id' ?  ctx.querystring.split('=')[1] : undefined
  const token = ctx.header['authorization']
  try {
    await validate(token)
    const { username } = splitToken(token)
    const admin = await operate['SelectOne']('user', { username: username })
    const res = await validateRole(ctx.db, admin, article_id, 'article')
    if (article_id && res) {
      await operate['Delete']('article', {
        article_id
      })
      await operate['Delete']('comment', {
        topic_id: article_id,
        topic_type: 'article'
      })
    } else {
      throw new Error('删除失败')
    }
    ctx.body = new ResModel().succeed(undefined, '删除成功')
  } catch(e) {
    ctx.body = new ResModel().err(undefined, e.message)
  }
})

module.exports = router