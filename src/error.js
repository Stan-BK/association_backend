module.exports = function generateError(error) {
  return error.errors ? error.errors[0].message : error.emessage
}