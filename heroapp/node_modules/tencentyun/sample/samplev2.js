var tencentyun = require('../');

// 10000002 即项目ID 在http://console.qcloud.com/image/bucket查看
// 后两项为secretid和secretkey 在http://console.qcloud.com/image/project查看
tencentyun.conf.setAppInfo('10000002', 'AKIDL5iZVplWMenB5Zrx47X78mnCM3F5xDbC', 'Lraz7n2vNcyW3tiP646xYdfr5KBV4YAv');

// 自定义空间名称，在http://console.qcloud.com/image/bucket创建
var bucket = 'test2';
// 自定义文件名
var fileid = 'sample' + parseInt(Date.now() / 1000);

tencentyun.imagev2.upload('/tmp/amazon.jpg', bucket, fileid, function(ret){

    console.log(ret);

    if (0 == ret.code) {
        var fileid = ret.data.fileid;

        // 查询
        tencentyun.imagev2.stat(bucket, fileid, function(ret) {
            console.log(ret);
        });

        var fileid = ret.data.fileid;

        // 生成私密下载url
        var expired = parseInt(Date.now() / 1000) + 60;
        var sign = tencentyun.auth.getAppSignV2(bucket, fileid, expired);
        console.log('downloadUrl is : ' + ret.data.downloadUrl + '?sign=' + sign);

        // 复制
        tencentyun.imagev2.copy(bucket, fileid, function(ret) {
            console.log(ret);
        });

        // 生成新的上传签名
        var expired = parseInt(Date.now() / 1000) + 60;
        var sign = tencentyun.auth.getAppSignV2(bucket, fileid, expired);
        console.log('sign is :'+sign);
        /*
        tencentyun.imagev2.delete(bucket, fileid, function(ret) {
            console.log(ret);
        });
        */
    }
});