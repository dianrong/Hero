
var libpath = './tencentyun';

module.exports = {
  auth:     require(libpath + '/auth.js'),
  conf:     require(libpath + '/conf.js'),
  video:    require(libpath + '/video.js'),
  image:    require(libpath + '/image.js'),
  imagev2:  require(libpath + '/imagev2.js'),
};
