# **本框架已经不再维护，转到Hero Node，增加区块链节点开发repo，低代码高信任 **

# **HERO 一个更好的移动跨平台开发方案**

hero移动开发方案源起于点融网LB业务部门的一次大胆的尝试，在点融的黑帮文化中发展出来的一个业界领先的开发方案。


## Hero 框架图

![Hero　Core](http://chuantu.biz/t5/59/1491534443x2890174334.png)

## Hero框架由以下repo组成
- [Hero-cli](https://github.com/dianrong/hero-cli) 		Hero的构建工具
- [Hero-iOS](https://github.com/dianrong/hero-ios) 		Hero的iOS实现
- [Hero-android](https://github.com/dianrong/hero-android) Hero的android实现
- [Hero-js](https://github.com/dianrong/hero-js) 			Hero的H5实现


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
![Hero　Core](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/gif3.gif)

- 测试驱动开发，由于任何新的功能都是先有测试用例才能开始，这是先天性的测试驱动开发。
- 全平台自动化测试，如图
![Hero　Core](https://raw.githubusercontent.com/dianrong/hero/master/heroapp/images/gif1.gif)

#### 用户行为分析
   在Hero框架中有一个理念，页面上不应该有任何的逻辑，页面（view controller\activity\page）只负责显示元素，元素本身只接json数据，界面显示成什么样子完全由接收到的json数据来决定，而且页面本身只有 in 和 out 两个函数分别对应元素反馈数据，和给元素的数据。我们在js中重载这两个函数，并将数据发送到日志服务器。就可以知道一个用户的所有操作，并可以对操作进行完整的回放。

#### hero不只是一个前端框架
Hero的核心理念是任何一个功能元素有且只有一个接口与外界交换数据。我曾经写了一个工具去检测一般项目中类之间的关系，方法是先找出当前项目的类列表，如果一个类中出现其它列表中的类就加1，结果是50个类平均结果是200左右，100个类平均结果是800左右，而且这个数以大于正比例曲线增长。大家可以想象一下一个新人面对一个大项目时候的囧迫，这简直是一张大网。传统的面向对象编程也许本身没有问题，但是在实际的的实践中遭遇了巨大的挑战，函数式编程是一种，而Hero是另外一种。
在服务端，Hero也有一个初步但是完整的实践，目录在hero-js/server当中。这里不再展开叙述。

## Hero技术委员会
| name           | 技术领域                                     |
|----------------|-------------------------------------------------|
| Andrew  		 | 提供技术资源                  |
| shaohua.yang   | review代码，负责技术规范		                   |
| 王海君          | 架构                         |
| 刘国平          | 架构                         |
| 朱成尧	     | Hero-js                                   |
| 朱靥超	     | Hero-iOS                                   |
| 胡本绿	     | Hero-Cli                                   |
| 蔡欣	     | Hero-android                                   |


## 贡献代码

提交到 
https://github.com/dianrong/Hero  

https://github.com/dianrong/Hero-ios  

https://github.com/dianrong/Hero-android 





