# **hero**
	一个简单的移动端跨平台方案
------------------------

## 如何使用
- 下载Hero-JS代码，使用node her.js启动服务端。
- H5直接打开http://localhost:3000/start.html
- iOS版本下载hero-ios代码将appDelegate中url地址设置为http://localhost:3000/start.html即可。
- android版本下载hero-android代码将直接打开MainPageActivity修改地址为 http://XXX.XXX.XX.XX:3000/start.html即可。

start.html是一个hello world页面，test/list.html里面包含了所有元素的单元测试页面（在hero框架中，单元测试既文档）
## 快速开始做页面
- 打开iOS，android项目运行sample项目，在chrome中访问http://localhost:3000/start.html (最好设置为device模式，PC web页面不是hero框架关注的方向)
- 使用sublime2 打开hero-js代码文件夹，尝试修改start.html


```
	{
		class:"HeroLabel",
		name:"name",
		textColor:"ffffff",
		text:"Hello hero !",
		size:22,
		frame:{"w":"1x",h:"80"},
		alignment:"center"
	},

```
**class** 一个界面元素必须包含的部分是，这指定了使用原生类的类型，
**frame** 指定了元素在界面中的布局，这个布局是三个平台上统一实现的
**name**  如果这个元素需要接收数据，那么给它设置一个name
其它option的属性，取决于元素是否实现

-------

```
	setTimeout(function() {
		API.out({command:'refresh'});
	}, 2000);

```
开发过程中使用定时刷新实现即时性效果,开发完成后注释掉
```
	setTimeout(function() {
		API.out({globle:{key:'finishLoading'}});
	}, 100);
```
每个APP的第一个页面需要使用通过globle通知发送finishLoading告诉app关闭封面，上新功能的时候也可以发送一个showLoading来展示一个新功能slider，展示期间可以缓存新的HTML页面
## 快速开始新的元素
- 新建一个元素只需要继承自原生元素中有类似功能的一个元素，然后实现一个on方法，与此元素相关的一切功能都通过on方法中传递过来的json对象来实现。
- on方法需要调用父类的on方法，基础的布局，背景，边框，hidden等属性都是在HeroView中已经实现好了，一般元素类只需要实现此元素特有的几个属性即可。
- 例：
```
@implementation HeroLabel
-(void)on:(NSDictionary *)json{
    [super on:json];
    if (json[@"text"]) {
       self.text = json[@"text"];
    }
    if (json[@"alignment"]) {
        NSString *alignment = json[@"alignment"];
        if ([alignment isEqualToString:@"center"]) {
            self.textAlignment = NSTextAlignmentCenter;
        }else if ([alignment isEqualToString:@"left"]){
            self.textAlignment = NSTextAlignmentLeft;
        }else if ([alignment isEqualToString:@"right"]){
            self.textAlignment = NSTextAlignmentRight;
        }
    }
    if (json[@"size"]) {
        double size = ((NSNumber*)json[@"size"]).doubleValue;
        self.font = [UIFont systemFontOfSize:size];
    }
    if (json[@"textColor"]) {
        self.textColor = UIColorFromStr(json[@"textColor"]);
    }
    if (json[@"font"]) {
        double size = ((NSNumber*)json[@"size"]).doubleValue;
        if ([@"bold" isEqualToString:json[@"font"]]) {
            self.font = [UIFont boldSystemFontOfSize:size];
        }
    }
}
@end
```
	**android的实现稍微有一点不同，由于java没法多继承，也没办法往系统库中注入方法，所以在android中实现一个基础类需要在on方法中调用的HeroView的静态方法on(view,json)来完成view的初始化。如果新元素继承了Hero元素则只需要和iOS一样调用super.on(json)即可。**
## 为什么使用hero框架

**简单**
- hero框架技术上并不复杂，核心逻辑代码不过200行
- 面向非开发人员，页面完全json描述，简单易懂。支持yaml语法，甚至不懂json格式也没有关系(test/list.html就是使用yaml缩进语法描述的)

**快速**
- 跨平台，做页面的时候，你并不关心页面展示的平台
- 你可以开多个不同平台，不同尺寸的模拟器，指向同一个页面，在页面中写上
```
	setTimeout(function() {
		API.out({command:'refresh'});
	}, 2000);
```
即可实现即时的多平台，多型号的页面真实效果。

**搞得定**
- 完全的可伸缩方案，我们推荐去客户端实现更多的复杂元素，这样在HTML中描述起来就简单，但是没有实现也没有关系，再复杂的元素也都是图片，文字，线条拼装出来的。
- 设备API调用也可通过自定义元素轻松实现，参见HeroLocationView。
- hero框架工作在ViewController(fragment/activity/page)层,任何现有项目都可以轻松接入。

**放心搞**
- hero框架有完美的单元测试机制，而且做到了测试既文档。
- hero框架在页面测试方面也有全新的体验。
- hero框架在所有平台是使用单一的接入点，方便在安全方面统一把守。
- hero框架完全开源，放心编译放心用

**搞出新天地**
- 跨平台的真原生页面，产品经理就可以轻松修改的的页面。
- 快速的将APP本地化，定制化。
- 支持快速变化的APP
- 元素使用filter模式，可以创造几乎不会崩溃的APP
- 改bug，上新版本，一般情况下，秒上生产。
- 我在上海新天地，但是在张江，在中关村，在成都软件园，都有人开始使用hero框架。

## 贡献
fork https://github.com/hero-mobile
提交一点代码就可能成为项目的核心成员哦。
产品经理需求可以提交代码到hero-js/client/test/unit_test/目录，并描述好元素需求并标明未实现，这个文件同时会成为这个元素的单元测试
开发者如果看到未实现的元素，可以提交代码实现它，实现一个属性后标注为已实现并签名。

## 交流
扫描二维码加入Hero框架交流群
![二维码](https://raw.githubusercontent.com/hero-mobile/hero-js/master/client/images/wechat.png)