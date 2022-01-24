const type = {
  200: 'success',
  400: '参数有误',
  404: '当前操作无权限',
  500: '服务器错误'
}

class Model {
  constructor() {
    this.code
    this.message = type[this.code]
    this.data = {} 
  }

  succeed(data, message) {
    this.data = data
    message ? this.message = message : ''
  }

  err(data, message) {
    data ? this.data = data : ''
    message ? this.message = message : ''
  }
}