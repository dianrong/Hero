var fs = require('fs');
var path = require('path');
var os = require('os');

// 请到app.qcloud.com查看您对应的appid相关信息并填充
exports.APPID = '您的APPID';
exports.SECRET_ID = '您的SECRET_ID';
exports.SECRET_KEY = '您的SECRET_KEY';

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'package.json')));
var ua = function() {
    return 'QcloudNodejs/' + pkg.version + ' (' + os.type() + '; ' + os.platform() + '; ' + os.arch() + '; ) ';
}

exports.USER_AGENT = ua;
exports.API_VIDEO_END_POINT = 'http://web.image.myqcloud.com/videos/v1/';
exports.API_IMAGE_END_POINT = 'http://web.image.myqcloud.com/photos/v1/';
exports.API_IMAGE_END_POINT_V2 = 'http://web.image.myqcloud.com/photos/v2/';

exports.setAppInfo = function(appid, secretId, secretKey) {
    module.exports.APPID = appid;
    module.exports.SECRET_ID = secretId;
    module.exports.SECRET_KEY = secretKey;
}
