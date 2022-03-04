const qiniu = require('qiniu')

var accessKey = 'IG047nuI4BKJmMb-Ru18OzWrOgz7p4YsZB06SyK6';
var secretKey = 'ipnfGjyzY-dd9B6V1_g6kDRaLiIhYlGyXNd0yzD8';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: 'association-source',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

module.exports = {
  uploadToken,
  formUploader,
  putExtra
}