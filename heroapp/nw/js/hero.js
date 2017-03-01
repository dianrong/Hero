/*
  hero.js
  hero

  Created by gpliu on 14/10/16.
  Copyright (c) 2015年 GPLIU. All rights reserved.
*/

var xhr = function () {
    var
    ajax = function  () {
        return ('XMLHttpRequest' in window) ? function  () {
                return new XMLHttpRequest();
            } : function  () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }(),
    formatData= function (fd) {
        var res = '';
        for(var f in fd) {
            if (fd[f]) {
                res += f+'='+fd[f]+'&';
            };
        }
        return res.slice(0,-1);
    },
    AJAX = function(ops) {
        var
        root = this,
        req = ajax();
        root.url = ops.url;
        root.contentType = ops.contentType;
        root.type = ops.type || 'responseText';
        root.method = ops.method || 'GET';
        root.async = ops.async || true;
        root.data = ops.data || {};
        root.complete = ops.complete || function  () {};
        root.success = ops.success || function(){};
        root.error =  ops.error || function (s) { alert(root.url+'->status:'+s+'error!')};
        root.abort = req.abort;
        root.timeout = ops.timeout || 30000;
        root.setData = function  (data) {
            for(var d in data) {
                root.data[d] = data[d];
            }
        }

        root.send = function  () {
            var datastring = root.data,get = false,async = root.async,complete = root.complete,method = root.method,type=root.type;
            if (!root.contentType) {
                datastring = formatData(root.data);
            };
            if(method === 'GET') {
                root.url+='?'+datastring;
                get = true;
            }
            req.timeout = root.timeout;
            req.open(method,root.url,async);
            if (host.search(/10./i) < 0) {
                req.withCredentials = true;
                req.setRequestHeader("X-Session-Share-Header",'true');
            };
            if(!get) {
                if (root.contentType) {
                    req.setRequestHeader("Content-type",root.contentType);
                }else{
                    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                }
            }

            //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调(chrome等在同步请求时也会执行onreadystatechange)
            req.onreadystatechange = async ? function  () {
                // console.log('async true');
                if (req.readyState ==4){
                    complete();
                    if(req.status == 200) {
                        root.success(req[type]);
                    } else {
                        root.error(req.status);
                    }
                }
            } : null;
            req.send(datastring);
            if(!async) {
                //console.log('async false');
                complete();
                root.success(req[type]);
            }
        }
        root.url && root.send();
    };
    return function(ops) {return new AJAX(ops);}
}();


var host = window.location.origin;
var path = host+'/borrower-static/cash/v1.1' //如果url路径有前缀请加上;
localStorage.versionPath = path;
var ui;
var err_ui = {
    nav:{
        title:"界面出错啦",
    },
    views:
    [
        {
            class:"HeroButton",
            frame:{x:"0.3x",y:"44",w:"0.4x",h:"66"},
            title:"刷新",
            click:{command:"refresh"}
        }
    ]
};
var loadedClass = [];
var ui2Data = {};
(function () {
    var w = window;
    var _deviceType = 'PC';
    var _userid;
    var _card;
    var _initData;
    var _outObjects;
    document.onreadystatechange = function () {
      var state = document.readyState;
      if (state == 'complete') {
        _initData = API.getInitData();
        if (_initData.test) {
            var js = document.createElement('script');
            js.src = host+window.location.pathname.replace(/html/,'js');
            document.head.appendChild(js);
            if (host.search(/10./)>0) {
                var js = document.createElement('script');
                js.src = path+'/js/log.js';
                document.head.appendChild(js);
            };
        };
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf("hero-ios") > 0){
            API.setDeviceType('IOS');
        }else if (ua.indexOf('hero-android') > 0) {
            API.setDeviceType('ANDROID');
        }else if(ua.indexOf('micromessenger') > 0){
            API.setDeviceType('WECHAT');
        }else{
            API.setDeviceType('PC');
            console.log('%cyou are hero !!! ', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
        };
        if (ui && ui.views) {
            API.ui2Data(ui.views);
        };
      }
    };
    w.API = {
        c0:'468BF6',
        c1:'cccccc',
        c2:'999999',
        c3:'666666',
        c4:'333333',
        c5:'1e304a',
        c6:'d70c18',
        c7:'ffffff',
        c8:'fbfbfb',
        c9:'f5f5f5',
        c10:'f0f0f0',
        c11:'e4e4e4',
        c12:'ff5500',
        c13:'ff7842',
        c14:'33b653',
        c15:'ffeeee',
        c16:'ffb7b7',
        c17:'f2fffd',
        c18:'daf8f3',
        c19:'37455c',
        c20:'f9fdfd',
        c21:'f4fbfb',
        c02:'009671',
        c62:'ac0913',
        c71:'ffffffb2',
    c75:'ffffff80',

        s0:'56',
        s6:'45',
        s9:'33',
        s1:'28',
        s7:'20',
        s2:'18',
        s3:'16',
        s4:'14',
        s5:'12',
        s8:'11',
        fmoney: function(s, n) {
            n = n >= 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + (r ? ("." + r) : '');
        },
        outObjects:function(){
            if (_outObjects) {
                var str = '';
                if (typeof(_outObjects) === 'string') {
                    str = _outObjects;
                }else{
                    str = JSON.stringify(_outObjects);
                }
                _outObjects = '';
                return str;
            }else{
                return '';
            }
        },
        out:function(data)
        {
            if (_deviceType == 'IOS') {
                _outObjects = data;
                var nativeObject = 'hero://' + 'ready';
                var iframe = document.createElement('iframe');
                iframe.setAttribute('src', nativeObject);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            }else if(_deviceType == 'IOS8'){
                window.webkit.messageHandlers.native.postMessage(data)
            }else if(_deviceType == 'ANDROID'){
                if (typeof(data) === 'object') {
                    data = JSON.stringify(data);
                };
                window.native.on(data);
            }else{
                API.page.on(data);
            }
        },
        in:function(data){
            if (typeof(data) === 'string') {
                data = JSON.parse(data);
            };
            if (data.serverLog) {
                data.serverLog = undefined;
                xhr({
                    url:('/api/v2/monitor/app'),
                    async:true,
                    // contentType:'application/json',
                    data:{path:window.location.href,log:JSON.stringify(data)},
                    method:'GET',
                    error:function(){}
                });
            };
            if (data.her) {
                if (_card.charAt(0) == '/') {
                    data = data.her;
                    xhr({
                        url:_card,
                        data:data,
                        async:true,
                        method:'GET',
                        success: function  (data) {
                            API.out(data);
                        },
                        error:function(data){
                            API.out(data);
                        }
                    });
                }else{
                    data = data.her;
                    data['userid'] = _userid;
                    data['card'] = _card;
                    io.emit('on', data);
                };
            }else if (data.socket) {
                io.emit('message', data.socket);
            }else if(data.http){
                if (data.http.keepError) {
                } else {
                    API.out({datas:{name:'toast',text:''}});
                }
                data = data.http;
                var api = data.url;
                var success = data.success;
                var fail = data.fail;
				var apiData = data.data;
                if (!data.contentType) {
                    for (var prop in apiData) {
                        apiData[prop] = encodeURIComponent(apiData[prop]);
                    }
                };
                xhr({
                    url:(api.search(/ttp/)>0?api:host+api),
                    async:true,
                    data:apiData,
                    contentType:data.contentType,
                    method:data.method?data.method:'GET',
                    timeout:data.timeout?data.timeout:30000,
                    success: function(data){
                        API.out({command:'stopLoading'});
                        if (typeof(data) === 'string') {
                            data = JSON.parse(data);
                        };
                        if (data.result === 'success') {
                            if (success) {
                                success(data);
                            }else{
                                data.api = api;
                                API.reloadData(data);
                            }
                        }else if(data.result === 'login'){
                            // localStorage.username = '';
                            if (localStorage.fastLoginType === 'kFaskLoginGesture') {
                                API.out({command:'present:'+path+'/protect_gesture.html'});
                            } else if (localStorage.fastLoginType === 'kFaskLoginTouchID') {
                                API.out({command:'present:'+path+'/protect_touchID.html'});
                            } else {
                                API.out({command:'present:'+path+'/login.html'});
                            }
                        } else if (data.result === 'error') {
                            if (data.errors && data.errors.length > 0) {
                                if (fail) {
                                    fail(data);
                                }else{
                                    API.out({datas:{name:'toast',text:data.errors[0]}});
                                }
                            }
                            else if (data.content) {
                                if (data.content.apiReturn) {
                                    if (data.content.apiReturn.ValidationError || data.content.apiReturn.ErrorMessage) {
                                        if (fail) {
                                            fail(data);
                                        }else{
                                            if (data.content.apiReturn.ValidationError) {
                                                API.out({datas:{name:'toast',text:data.content.apiReturn.ValidationError}});
                                            } else {
                                                API.out({datas:{name:'toast',text:data.content.apiReturn.ErrorMessage}});
                                            }
                                        }
                                    };
                                };
                            };
                        }else{
                            API.reloadData(data);
                        }
                    },
                    error:function(data){
                        API.out({command:'stopLoading'});
                        if (fail) {
                            fail({errors:['网络异常，请检查网络连接后重试']});
                        }else{
                            API.out({datas:{name:'toast',icon:'error_icon',text:'网络异常，请检查网络连接后重试'}});
                        }
                    }
                });
            }else{
                if(data.name && data.value){
                    ui2Data['_'+data.name] = data.value;
                }
                API.special_logic(data);
            };
        },
        special_logic:function(){
            //需要被各个页面重写的方法
        },
        boot:function(){
            //需要被各个页面重写的方法
        },
        reloadData:function(){
            //需要被各个页面重写的方法
        },
        deviceType:function()
        {
            return _deviceType;
        },
        setDeviceType:function(deviceType)
        {
            _deviceType = deviceType;
            if (ui === undefined) {
                ui = err_ui;
            };
            if (ui !== 'blank') {
                API.out({ui:ui});
            };
            if(_deviceType === 'IOS'){
                API.boot(_initData);
            }else if(_deviceType === 'ANDROID'){
                API.boot(_initData);
            }else{
                if (ui && ui.views) {
                    API.ui2Data(ui.views);
                };
                setTimeout(function() {
                    API.boot(_initData);
                }, 500);
            }
        },
        setUserid:function(userid)
        {
            _userid = userid;
        },
        setCard:function(card){
            _card = card;
            if (_card.charAt(0) !== '/') {
                API.connect();
            }
        },
        getInitData:function(){
            if (localStorage.boot) {
                _initData = JSON.parse(localStorage.boot);
                localStorage.boot = '';
            };
            _initData = _initData || {};
            var params = (window.location.search.split('?')[1] || '').split('&');
            for(var param in params) {
                if (params.hasOwnProperty(param)){
                    paramParts = params[param].split('=');
                    _initData[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
                 }
            }
            return _initData;
        },
        ui2Data:function(observeUI){
            if (observeUI instanceof Array) {
                for (var i = 0; i < observeUI.length; i++) {
                    API.ui2Data(observeUI[i]);
                };
            }else if(observeUI.subViews){
                API.ui2Data(observeUI.subViews);
            }
            if (observeUI.name) {
                ui2Data['_'+observeUI.name] = '';
                ui2Data.__defineSetter__(observeUI.name, function(v) {
                    ui2Data['_'+observeUI.name] = v;
                    var data = {name:observeUI.name};
                    if (typeof v == 'string') {
                        data.text = v;
                    }else{
                        API.merge(data,v);
                    }
                    API.out({datas:data});
                });
                ui2Data.__defineGetter__(observeUI.name, function() {
                    return ui2Data['_'+observeUI.name];
                });

            };
        },
        getDeviceType:function()
        {
            return _deviceType;
        },
        getVersion:function()
        {
            return '0.0.1';
        },
        getCookie:function(name) {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        camelCase2bar:function(str){
          var low = str.toLowerCase();
          var des = low.substr(0,2);
          for(var i = 2 ; i < str.length;i++){
            if (str.charAt(i) !== low.charAt(i)) {
              des = des.concat('-' + low.charAt(i));
            }else{
              des = des.concat(low.charAt(i));
            };
          }
          return des;
        },
        createElementFromJson:function(json){
            var viewName = json.class || json.res;
            if (viewName ) {
                var className = API.camelCase2bar(viewName);
                var str = '<'+className+' json='+encodeURIComponent(JSON.stringify(json))+'></'+className+'>';
                return str;
            };
            return '';
        },
        contain:function(objs,obj){var i = objs.length;while (i--) {if (objs[i] === obj) {return true;}}return false;},
        merge:function(o1,o2){for(var key in o2){o1[key]=o2[key]}return o1},
        remove:function(arr,value) {if(!arr)return;var a = arr.indexOf(value);if (a >= 0){arr.splice(a, 1)}},
    };
})();
