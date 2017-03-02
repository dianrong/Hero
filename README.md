# **给大家介绍一个更好的移动跨平台开发方案**
	hero移动开发方案源起于点融网LB业务部门的一次无心的尝试，在点融的黑帮文化中发展出来的一个业界领先的开发方案。
------------------------
先来一个类似产品的对比

   | react native | weex | 小程序 | ionic | Hero 
----|------|-------|------|----|----|----
性能 | 良  | 良 | 尚可 | 尚可 | 优
布局 | 无序性能差 | 无序性能差 | 尚可 | 无序 | 类似iOS性能好
设备能力 | 完全 | 完全 | 不完全 | 完全 | 完全
开发成本 | 高级跨平台工程师 | 不详 | 高级web工程师 | 高级web工程师 | 初级js程序员
开发工具 | 多种 | 不详 | 微信web开发工具 | 多种 | Hero开发者工具
框架代码量 | 巨大 |巨大 | 非开源 | 大 | 少
入门难度 | 难 | 难 | 普通 | 有点难 | 容易




###### 解释上述表格
**性能**
react native和weex界面表现层是原生的，但是构造元素本身的操作，和元素的所有逻辑在js中，导致性能有影响
**布局能力**
CSS几乎可以表示一切形式的界面，无设计语言约束，但是最终效果有时候与平台的冲突会造成编程的困惑与体验的变差，react native 和weex的css依赖webview的渲染，再将结果发送给原生导致性能损失很大。微信在自家产品中的约束样式反而还不错。Hero是另辟蹊径定义了一套扩展后的frame布局，并且在各平台原生实现这套方案，布局能力达到并兼容原生app。
**设备能力**
微信提供了有限受控的设备能力，其它皆有完全的设备能力(系统支持)
**开发成本**
由于react native开发门槛较高，学习曲线很陡，特别是对移动开发人员，很难适应web开发模式，而web工程师对iOS本身的接口不熟悉，很难做出原生体验的app出来，weex应该也类似。还有不管是react native 还是weex所开发出来的页面不是完全跨平台的，它们只是开发方式是跨平台的，具体页面还是要分开开发。导致开发人员需求依旧那么多，甚至更多。而hero是一种依赖 **定义<->实现** 的开发方案，所开发的界面是平台无关的，再加上统一的元素定义格式，对于具体的页面开发人员来说，只是在配制显示的元素，非常简单。
**开发工具**
目前Hero的开发没有限定开发工具，sublime和atom都可以，调试就在chrome里面调试web页面就好了。集成编码、调试、托管服务端的Hero开发者工具正在开发过程当中。开发者工具本身也是用hero框架开发，目录在hero-js／heroapp当中。只需要切换到heroapp目录，使用nwjs .即可打开预览版本。
**框架代码量**
hero框架技术上并不复杂，核心逻辑代码不过200行。
**入门难度**
Hero框架中只有一个固定的controller，其它全部都是element，相比其它的MVP、MVVM、MVC有着复杂的逻辑关系，Hero中的模式就是** e **, **ee**,  **eeeeee...**,通通都是element，controller除了用来显示element，给element传递json数据之外就没有额外的逻辑了。element 中只有一个函数处理json对象，除此之外再无其它接口。每个element 都是绝对独立的，与其它元素毫无瓜葛。这样开发、测试元素都是及其简单的。

## Hero 框架图

![Hero　Core](http://chuantu.biz/t5/48/1488358929x3728884133.png)
![Hero　extend](http://chuantu.biz/t5/48/1488359025x3728884133.png)
![Hero　App](http://chuantu.biz/t5/48/1488359065x3728884133.png)

## 快速开始
- 下载Hero代码，使用node her.js启动服务端。
- 打开http://localhost:3000 可以看到一个Hero的主页，这里面有hero的概念展示、API doc等常用信息。
- iOS版本中集成https://github.com/dianrong/hero-ios 这个SDK，然后用HeroViewController打开一个包含Hero元素的页面即可。
- android版本中集成https://github.com/dianrong/hero-android 这个SDK，使用HeroActivity打开一个包含Hero元素的页面即可。

## 快速开始做页面
- 在chrome中访问http://localhost:3000/start.html
- 使用sublime2 打开start代码文件夹，尝试修改index.html


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

## Hero 不止是一个开发框架，而是一个开发方案

#### 开发过程管理
- 新的框架需求可以提交代码到hero-js/test/test/unit_test/目录,具体的提交内容是一个json文件类似
```
	{
		class:"MyLabel", 		//新功能的元素名
		p1:"xxxxx",	  		//新熟悉接受什么样的参数，结果如何
		text:"Hello hero !",
		size:22,
		frame:{"w":"1x",h:"80"},
		alignment:"center"
	},
```
测试系统会自动为这个元素生成测试用例，如果各个平台上打开此测试用例结果都正确，表明这个元素实现完成。单元测试如下图
![Hero　Core](http://chuantu.biz/t5/48/1488365021x3728884133.gif)

- 测试驱动开发，由于任何新的功能都是先有测试用例才能开始，这是先天性的测试驱动开发。
- 全平台自动化测试，如图
![Hero　Core](http://chuantu.biz/t5/48/1488364797x3728884133.gif)



## 贡献
fork https://github.com/hero-mobile
提交一点代码就可能成为项目的核心成员哦。
产品经理需求可以提交代码到hero-js/client/test/unit_test/目录，并描述好元素需求并标明未实现，这个文件同时会成为这个元素的单元测试
开发者如果看到未实现的元素，可以提交代码实现它，实现一个属性后标注为已实现并签名。

## 交流
扫描二维码加入Hero框架交流群
![二维码](https://raw.githubusercontent.com/hero-mobile/hero-js/master/client/images/wechat.png)