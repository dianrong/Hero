var http = require('http');
var urlM = require('url');
var fs = require('fs');
var crypto = require('crypto');
var formstream = require('formstream');
var auth = require('./auth');
var conf = require('./conf');

// 30 days
var EXPIRED_SECONDS = 2592000;

/**
 * 上传本地图片文件
 * @param  {string / Buffer}   fileObj      图片本地路径或保存有二进制图片数据的Buffer，必须
 * @param  {Function}          callback     用户上传完毕后执行的回调函数，可选，默认输出日志
 *                                          入参为ret：{'httpcode':200,'code':0,'message':'ok','data':{...}}
 * @param  {string}            userid       用户自定义的业务ID，可选，默认为0
 * @param  {string}            magicContext 业务附加信息,用于透传回调用者的业务后台，可以为NULL
 * @return NULL
 */
exports.upload = function(fileObj, bucket, fileid, callback, userid, magicContext) {


    var isBuffer = false
    var isExists = false

    if (fileObj instanceof Buffer) {
        isBuffer = true
    } else if (typeof fileObj == 'string' || fileObj instanceof String) {
		var filePath=fileObj;
        isExists = fs.existsSync(fileObj)
    }

    userid = userid || 0;
    fileid = fileid || '';
    callback = callback || function(ret){console.log(ret)};

    if (!bucket) {
        // error, bucket not defined
        callback({'httpcode':0, 'code':-1, 'message':'bucket must be input as params', 'data':{}});
    }

    if ((isBuffer || isExists) && typeof callback === 'function') {
        var url = generateResUrlV2(bucket, userid, fileid);
        var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
        var sign  = auth.getAppSignV2(bucket, fileid, expired);
        var urlInfo = urlM.parse(url);
        var form = formstream();
                
        if (magicContext) {
            form.field('magiccontext', magicContext);
        }

        // if file object is a filename
        if (isExists) {
            var stats = fs.statSync(fileObj);
            var fileSizeInBytes = stats["size"];

            form.file('filecontent', fileObj, '', fileSizeInBytes);
        // else if file object if a file buffer
        } else {
            form.buffer('filecontent', fileObj, 'untitled')
        }


        var headers = form.headers();
        headers['Authorization'] = 'QCloud ' + sign;
        headers['User-Agent'] = conf.USER_AGENT();

        var options = {
            hostname: urlInfo.hostname,
            port: urlInfo.port || 80,
            path: urlInfo.path,
            method: 'POST',
            headers: headers
        };

        var req = http.request(options, function (res) {
            res.on('data', function (data) {
                var ret = {};
                try {
                    var ret = JSON.parse(data.toString());
                } catch (err) {
                    ret = {};
                }
                if (ret) {
                    var result = {
                        'httpcode':res.statusCode,
                        'code':ret.code, 
                        'message':ret.message || '', 
                        'data':{}
                    }

                    if (0 == ret.code) {
                        result.data = {
                            'downloadUrl':ret.data.download_url || '',
                            'fileid':ret.data.fileid || '',
                            'url':ret.data.url || '',
                            'info':ret.data.info || ''
                        }
                    }

                    callback(result);

                } else {
                    callback({'httpcode':res.statusCode, 'code':-1, 'message':'response '+data.toString()+' is not json', 'data':{}});
                }
            });
        });

        form.pipe(req);

    } else {
        // error, file not exists
        callback({'httpcode':0, 'code':-1, 'message':'file '+filePath+' not exists or params error', 'data':{}});
    }
}

/**
 * 查询视频
 * @param  {string}   fileid   图片文件唯一ID
 * @param  {Function} callback 用户查询完毕后执行的回调函数，可选，默认输出日志
 *                             入参为ret：{'httpcode':200,'code':0,'message':'ok','data':{...}}
 * @param  {string}   userid   用户自定义业务ID，可选，默认为0
 * @return {NULL} 
 */
exports.stat = function(bucket, fileid, callback, userid) {
    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (fileid && typeof callback === 'function') {
        var url = generateResUrlV2(bucket, userid, fileid);
        var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
        var sign  = auth.getAppSignV2(bucket, fileid, expired);
        var urlInfo = urlM.parse(url);
        
        var headers = {};
        headers['Authorization'] = 'QCloud ' + sign;
        headers['User-Agent'] = conf.USER_AGENT();

        var options = {
            hostname: urlInfo.hostname,
            port: urlInfo.port || 80,
            path: urlInfo.path,
            method: 'GET',
            headers: headers
        };

        var req = http.request(options, function (res) {
            res.on('data', function (data) {
                var ret = {};
                try {
                    var ret = JSON.parse(data.toString());
                } catch (err) {
                    ret = {};
                }
                if (ret) {
                    var result = {
                        'httpcode':res.statusCode,
                        'code':ret.code, 
                        'message':ret.message || '', 
                        'data':{}
                    }

                    if (0 == ret.code) {
                        result.data = {
                            'downloadUrl':ret.data.file_url || '', 
                            'fileid':ret.data.file_fileid || '',
                            'uploadTime':ret.data.file_upload_time || '',
                            'size':ret.data.file_size || '',
                            'md5':ret.data.file_md5 || '', 
                            'width':ret.data.photo_width || '', 
                            'height':ret.data.photo_height || ''
                        }
                    }

                    callback(result);
                } else {
                    callback({'httpcode':res.statusCode, 'code':-1, 'message':'response '+data.toString()+' is not json', 'data':{}});
                }
            });
        });

        req.write('');
        req.end();

    } else {
        // error
        callback({'httpcode':0, 'code':-1, 'message':'params error', 'data':{}});
    }
}

exports.copy = function(bucket, fileid, callback, userid) {

    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (fileid && typeof callback === 'function') {
        var url = generateResUrlV2(bucket, userid, fileid, 'copy');
        var expired = 0;
        var sign  = auth.getAppSignV2(bucket, fileid, expired);
        var urlInfo = urlM.parse(url);
        
        var headers = {};
        headers['Authorization'] = 'QCloud ' + sign;
        headers['User-Agent'] = conf.USER_AGENT();

        var options = {
            hostname: urlInfo.hostname,
            port: urlInfo.port || 80,
            path: urlInfo.path,
            method: 'POST',
            headers: headers
        };

        var req = http.request(options, function (res) {
            res.on('data', function (data) {
                var ret = {};
                try {
                    var ret = JSON.parse(data.toString());
                } catch (err) {
                    ret = {};
                }
                if (ret) {
                    var result = {
                        'httpcode':res.statusCode,
                        'code':ret.code, 
                        'message':ret.message || '', 
                        'data':{
                            'downloadUrl':ret.data.download_url || '', 
                            'url':ret.data.url || '',
                        }
                    }
                    callback(result);
                } else {
                    callback({'httpcode':res.statusCode, 'code':-1, 'message':'response '+data.toString()+' is not json', 'data':{}});
                }
            });
        });

        req.write('');
        req.end();

    } else {
        // error
        callback({'httpcode':0, 'code':-1, 'message':'params error', 'data':{}});
    }
}


/**
 * 删除视频
 * @param  {string}   fileid   视频文件在腾讯云存储的唯一ID，必须
 * @param  {Function} callback 用户删除完毕后执行的回调函数，可选，默认输出日志
 *                             入参为ret：{'httpcode':200,'code':0,'message':'ok','data':{...}}
 * @param  {string}   userid   用户自定义的业务ID，可选，默认为0
 * @return {NULL}   
 */
exports.delete = function(bucket, fileid, callback, userid) {

    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (fileid && typeof callback === 'function') {
        var url = generateResUrlV2(bucket, userid, fileid, 'del');
        var expired = 0;
        var sign  = auth.getAppSignV2(bucket, fileid, expired);
        var urlInfo = urlM.parse(url);
        
        var headers = {};
        headers['Authorization'] = 'QCloud ' + sign;
        headers['User-Agent'] = conf.USER_AGENT();

        var options = {
            hostname: urlInfo.hostname,
            port: urlInfo.port || 80,
            path: urlInfo.path,
            method: 'POST',
            headers: headers
        };

        var req = http.request(options, function (res) {
            res.on('data', function (data) {
                var ret = {};
                try {
                    var ret = JSON.parse(data.toString());
                } catch (err) {
                    ret = {};
                }
                if (ret) {
                    var result = {
                        'httpcode':res.statusCode,
                        'code':ret.code, 
                        'message':ret.message || '', 
                        'data':{}
                    }
                    callback(result);
                } else {
                    callback({'httpcode':res.statusCode, 'code':-1, 'message':'response '+data.toString()+' is not json', 'data':{}});
                }
            });
        });

        req.write('');
        req.end();

    } else {
        // error
        callback({'httpcode':0, 'code':-1, 'message':'params error', 'data':{}});
    }
}

exports.generateResUrlV2 = function (bucket, userid, fileid, oper) {
    return generateResUrlV2(bucket, userid, fileid, oper);
}


function generateResUrlV2(bucket, userid, fileid, oper) {
    if (fileid) {
        fileid = encodeURIComponent(fileid);
        if (oper) {
            return conf.API_IMAGE_END_POINT_V2 + conf.APPID + '/' + bucket + '/' + userid + '/' + fileid + '/' + oper;
        } else {
            return conf.API_IMAGE_END_POINT_V2 + conf.APPID + '/' + bucket + '/' + userid + '/' + fileid;
        }
    } else {
        return conf.API_IMAGE_END_POINT_V2 + conf.APPID + '/' + bucket + '/' + userid;
    }
}
