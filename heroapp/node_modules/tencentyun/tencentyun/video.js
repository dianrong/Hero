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
 * 上传本地视频文件
 * @param  {string}   filePath     视频本地路径，必须
 * @param  {Function} callback     用户上传完毕后执行的回调函数，可选，默认输出日志
 *                                 入参为ret：{'httpcode':200,'code':0,'message':'ok','data':{...}}
 * @param  {string}   userid       用户自定义的业务ID，可选，默认为0
 * @param  {object}   fileInfo     文件信息，可以为NULL
 *                                 sha       : 视频文件的sha
 *                                 title     : 视频的标题
 *                                 desc      : 视频的描述
 *                                 coverframe: 使用第几秒的关键帧作为视频封面(只有使用了转码的业务才有封面)
 * @param  {string}   magicContext 业务附加信息,用于透传回调用者的业务后台，可以为NULL
 * @return NULL
 */
exports.upload = function(filePath, callback, userid, fileInfo, magicContext) {

    var isExists = fs.existsSync(filePath);
    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (isExists && typeof callback === 'function') {
        var url = generateResUrl(userid);
        var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
        var sign  = auth.appSign(url, expired);
        var urlInfo = urlM.parse(url);
        var form = formstream();
        
        if (fileInfo) {
            if (fileInfo.sha) {
                form.field('Sha', fileInfo.sha);
            }
            if (fileInfo.title) {
                form.field('Title', fileInfo.title);
            }
            if (fileInfo.desc) {
                form.field('Desc', fileInfo.desc);
            }
            if (fileInfo.coverframe) {
                form.field('coverframe', fileInfo.coverframe);
            }
        }
        
        if (magicContext) {
            form.field('magiccontext', magicContext);
        }

        var stats = fs.statSync(filePath);
        var fileSizeInBytes = stats["size"];

        form.file('filecontent', filePath, '', fileSizeInBytes);

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
                            'coverUrl':ret.data.cover_url || '', 
                            'downloadUrl':ret.data.download_url || '',
                            'fileid':ret.data.fileid || '',
                            'url':ret.data.url || ''
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
 * @param  {string}   fileid   视频文件唯一ID
 * @param  {Function} callback 用户查询完毕后执行的回调函数，可选，默认输出日志
 *                             入参为ret：{'httpcode':200,'code':0,'message':'ok','data':{...}}
 * @param  {string}   userid   用户自定义业务ID，可选，默认为0
 * @return {NULL} 
 */
exports.stat = function(fileid, callback, userid) {
    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (fileid && typeof callback === 'function') {
        var url = generateResUrl(userid, fileid);
        var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
        var sign  = auth.appSign(url, expired);
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
                            'fileSha':ret.data.file_sha || '', 
                            'fileSize':ret.data.file_size || '',
                            'fileUploadTime':ret.data.file_upload_time || '',
                            'fileUrl':ret.data.file_url || '',
                            'videoCoverUrl':ret.data.video_cover_url || '', 
                            'videoDesc':ret.data.video_desc || '', 
                            'videoStatus':ret.data.video_status || '', 
                            'videoStatusMsg':ret.data.video_status_msg || '', 
                            'videoTitle':ret.data.video_title || ''
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
exports.delete = function(fileid, callback, userid) {

    userid = userid || 0;
    callback = callback || function(ret){console.log(ret)};

    if (fileid && typeof callback === 'function') {
        var url = generateResUrl(userid, fileid, 'del');
        var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
        var sign  = auth.appSign(url, expired);
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


function generateResUrl(userid, fileid, oper) {
    if (fileid) {
        if (oper) {
            return conf.API_VIDEO_END_POINT + conf.APPID + '/' + userid + '/' + fileid + '/' + oper;
        } else {
            return conf.API_VIDEO_END_POINT + conf.APPID + '/' + userid + '/' + fileid;
        }
    } else {
        return conf.API_VIDEO_END_POINT + conf.APPID + '/' + userid;
    }
}