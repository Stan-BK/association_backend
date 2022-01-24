const Router = require('koa-router')
const router = new Router()
const association = require('./association')
const user = require('./user')
const article = require('./article')
const announcement = require('./announcement')
const comment = require('./comment')


router.use('', association.routes(), association.allowedMethods())
router.use('', user.routes(), user.allowedMethods())
router.use('', article.routes(), article.allowedMethods())
router.use('', announcement.routes(), announcement.allowedMethods())
router.use('', comment.routes(), comment.allowedMethods())

module.exports = router