var crypto = require('crypto');
var urlM = require('url');
var conf = require('./conf');

exports.AUTH_URL_FORMAT_ERROR = -1;
exports.AUTH_SECRET_ID_KEY_ERROR = -2;

exports.getAppSignV2 = function(bucket, fileid, expired, userid) {
    var now            = parseInt(Date.now() / 1000);
    var rdm            = parseInt(Math.random() * Math.pow(2, 32));
    var puserid        = '';
    userid = userid || '0';

    var appid = conf.APPID, secretId = conf.SECRET_ID, secretKey = conf.SECRET_KEY;

    if (!appid.length || !secretId.length || !secretKey.length){
        return AUTH_SECRET_ID_KEY_ERROR;
    }

    if(typeof userid === 'string'){
        if(userid.length > 64){
            return AUTH_URL_FORMAT_ERROR;
        }
        if ('0' !== userid) {
            puserid = userid;
        }
    }
        
    var plainText = 'a='+appid+'&b='+bucket+'&k='+secretId+'&e='+expired+'&t='+now+'&r='+rdm+'&u='+puserid+'&f='+fileid;
    
    var data = new Buffer(plainText,'utf8');
    
    var res = crypto.createHmac('sha1',secretKey).update(data).digest();
    
    var bin = Buffer.concat([res,data]);
    
    var sign = bin.toString('base64');

    return sign;
}


exports.appSignV2 = function(url, expired) {

    var now            = parseInt(Date.now() / 1000);
    var rdm            = parseInt(Math.random() * Math.pow(2, 32));
    var puserid        = '';
    var fileid         = null;

    var secretId = conf.SECRET_ID, secretKey = conf.SECRET_KEY;

    if (!secretId.length || !secretKey.length){
        return AUTH_SECRET_ID_KEY_ERROR;
    }

    var urlInfo = getInfoFromUrlV2(url);
    if (!urlInfo) {
        return AUTH_URL_FORMAT_ERROR;
    }

    var cate = urlInfo.cate || '';
    var ver = urlInfo.ver || '';
    var appid = urlInfo.appid, userid = urlInfo.userid, bucket = urlInfo.bucket;
    var style = urlInfo.style || '';
    var oper = urlInfo.oper || '';
    var fileid = urlInfo.fileid || '';

    // del and copy get once sign
    var onceOpers = ['del','copy'];
    if(oper && -1 != onceOpers.indexOf(oper)) {
        expired = 0;
    }
    if (!oper && fileid && !style) {
        fileid = '';
    }

    if(typeof userid === 'string'){
        if(userid.length > 64){
            return AUTH_URL_FORMAT_ERROR;
        }
        if ('0' !== userid) {
            puserid = userid;
        }
    }
        
    var plainText = 'a='+appid+'&k='+secretId+'&e='+expired+'&t='+now+'&r='+rdm+'&u='+puserid+'&f='+fileid;
    
    var data = new Buffer(plainText,'utf8');
    
    var res = crypto.createHmac('sha1',secretKey).update(data).digest();
    
    var bin = Buffer.concat([res,data]);
    
    var sign = bin.toString('base64');

    return sign;
}


exports.appSign = function(url, expired) {

    var now            = parseInt(Date.now() / 1000);
    var rdm            = parseInt(Math.random() * Math.pow(2, 32));
    var puserid        = '';
    var fileid         = null;

    var secretId = conf.SECRET_ID, secretKey = conf.SECRET_KEY;

    if (!secretId.length || !secretKey.length){
        return module.exports.AUTH_SECRET_ID_KEY_ERROR;
    }

    var urlInfo = getInfoFromUrl(url);
    if (!urlInfo) {
        return module.exports.AUTH_URL_FORMAT_ERROR;
    }

    var cate = urlInfo.cate || '';
    var ver = urlInfo.ver || '';
    var appid = urlInfo.appid, userid = urlInfo.userid;
    var style = urlInfo.style || '';
    var oper = urlInfo.oper || '';
    var fileid = urlInfo.fileid || '';

    // del and copy get once sign
    var onceOpers = ['del','copy'];
    if(oper && -1 != onceOpers.indexOf(oper)) {
        expired = 0;
    }

    if(typeof userid === 'string'){
        if(userid.length > 64){
            return module.exports.AUTH_URL_FORMAT_ERROR;
        }
        puserid = userid;
    }
        
    var plainText = 'a='+appid+'&k='+secretId+'&e='+expired+'&t='+now+'&r='+rdm+'&u='+puserid+'&f='+fileid;
    
    var data = new Buffer(plainText,'utf8');
    
    var res = crypto.createHmac('sha1',secretKey).update(data).digest();
    
    var bin = Buffer.concat([res,data]);
    
    var sign = bin.toString('base64');

    return sign;
}

function getInfoFromUrlV2(url) {
    var args = urlM.parse(url);
    var argsEndPointImg = urlM.parse(conf.API_IMAGE_END_POINT_V2);
    if (args.hostname == argsEndPointImg.hostname) {
        if (args.pathname) {
            var parts = args.pathname.split('/');
            switch (parts.length) {
                case 6:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    bucket = parts[4];
                    userid = parts[5];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'bucket':bucket, 'userid':userid};
                break;
                case 7:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    bucket = parts[4]
                    userid = parts[5];
                    fileid = parts[6];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'bucket':bucket, 'userid':userid, 'fileid':fileid};
                break;
                case 8:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    bucket = parts[4]
                    userid = parts[5];
                    fileid = parts[6];
                    oper = parts[7];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'bucket':bucket, 'userid':userid, 'fileid':fileid, 'oper':oper};
                break;
                default:
                    return {};
            }
        } else {
            return {};
        }
    } else {
        if (args.pathname) {
            var parts = args.pathname.split('/');
            switch (parts.length) {
                case 5:
                    var arr = parts[1].split('-');
                    if (2 != arr.length) {
                        return {};
                    }
                    bucket = arr[0];
                    appid = arr[1];
                    userid = parts[2];
                    fileid = parts[3];
                    style = parts[4];
                    return {'appid':appid, 'bucket':bucket, 'userid':userid, 'fileid':fileid, 'style':style};
                break;
                default:
                    return {};
            }
        } else {
            return {};
        }
    }
}


function getInfoFromUrl(url) {
    var args = urlM.parse(url);
    var argsEndPointImg = urlM.parse(conf.API_IMAGE_END_POINT);
    var argsEndPointVideo = urlM.parse(conf.API_VIDEO_END_POINT);
    if (args.hostname == argsEndPointImg.hostname || args.hostname == argsEndPointVideo.hostname) {
        if (args.pathname) {
            var parts = args.pathname.split('/');
            switch (parts.length) {
                case 5:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    userid = parts[4];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'userid':userid};
                break;
                case 6:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    userid = parts[4];
                    fileid = parts[5];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'userid':userid, 'fileid':fileid};
                break;
                case 7:
                    cate = parts[1];
                    ver = parts[2];
                    appid = parts[3];
                    userid = parts[4];
                    fileid = parts[5];
                    oper = parts[6];
                    return {'cate':cate, 'ver':ver, 'appid':appid, 'userid':userid, 'fileid':fileid, 'oper':oper};
                break;
                default:
                    return {};
            }
        } else {
            return {};
        }
    } else {
        if (args.pathname) {
            var parts = args.pathname.split('/');
            switch (parts.length) {
                case 5:
                    appid = parts[1];
                    userid = parts[2];
                    fileid = parts[3];
                    style = parts[4];
                    return {'appid':appid, 'userid':userid, 'fileid':fileid, 'style':style};
                break;
                default:
                    return {};
            }
        } else {
            return {};
        }
    }
}
