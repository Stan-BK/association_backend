const type = {
  200: 'success',
  400: '参数有误',
  404: '当前操作无权限',
  500: '服务器错误'
}

class Model {
  constructor() {
    this.code = 200
    this.message = type[this.code]
    this.data = {} 
  }

  succeed(data, message, code) {
    this.code = code ? code : 200
    this.data = data
    this.message = message ? message : type[this.code]
    return this
  }

  err(data, message, code) {
    this.code = code ? code : 404
    this.data = data
    this.message = message ? message : type[this.code]
    return this
  }
}

module.exports = Model