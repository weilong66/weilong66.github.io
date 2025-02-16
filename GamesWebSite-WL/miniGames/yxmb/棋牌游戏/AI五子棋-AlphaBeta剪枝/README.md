## 五子棋AI

项目源码地址：[GitHub - lihongxun945/gobang: javascript gobang AI，JS五子棋AI，源码+教程，基于Alpha-Beta剪枝算法（不是神经网络）](https://github.com/lihongxun945/gobang?tab=readme-ov-file)

极小化极大算法的五子棋AI实现，基于Alpha-Beta剪枝算法（不是神经网络）。



## 一些常见问题

- Q：AI的原理是什么？
- A：参考后文中我的博客。基本原理是极小化极大搜索算法，做了一些常见的性能优化。没有用到神经网络、强化学习之类的机器学习算法。
- Q：为什么感觉AI的棋力不强？
- A：这个AI是极小化极大算法，做了有限的优化，并且受限于浏览器执行JS的速度，其搜索的深度比较浅，所以棋力不会很强。
- Q：不同难度有啥区别？
- A：不同难度的区别在于搜索的深度，AI的搜索深度越深，棋力越强，相应的耗时也会变长。
- Q：需要联网吗？
- A：第一次打开页面或者刷新需要联网，但AI的执行是本地的，因此只要页面打开之后，就不需要联网了。
- Q：为啥感觉电脑走棋很慢？
- A：这个AI是本地浏览器执行的，AI的速度受硬件性能影响比较大，并且难度越高，搜索的深度越深，耗时越长。如果发现耗时过长，可以降低难度。
- Q：AI涉及到的算法是你原创的吗？
- A：并不是我原创的，绝大部分都是网络上公开的算法，我只是把它们组合起来，并做了一些有限的优化。

## 联系方式

需要交流的同学可以加QQ群 `622613966`,进群验证信息请填写 `gobang`

## 更新日志

- 2023/11/23 更新：V3版本重写了所有代码，现在代码更加简洁易懂，并修复了之前存在的AI可能会偶尔走错棋的问题，棋力更加稳定。
- 2020/11/29 更新: 修复了评分的明显bug，随机开局库可配置，网站已修复，可以愉快玩耍了

## 教程

我写了一个系列博客，教你如何一步步编写自己的五子棋AI：

- [五子棋AI设计教程第二版一：前言](https://github.com/lihongxun945/myblog/issues/11)
- [五子棋AI设计教程第二版二：博弈算法的前世今生](https://github.com/lihongxun945/myblog/issues/12)
- [五子棋AI设计教程第二版三：极小化极大值搜索](https://github.com/lihongxun945/myblog/issues/13)
- [五子棋AI设计教程第二版四：Alpha Beta 剪枝算法](https://github.com/lihongxun945/myblog/issues/14)
- [五子棋AI设计教程第二版五：启发式评估函数](https://github.com/lihongxun945/myblog/issues/15)
- [五子棋AI设计教程第二版六：迭代加深](https://github.com/lihongxun945/myblog/issues/16)
- [五子棋AI设计教程第二版七：Zobrist缓存](https://github.com/lihongxun945/myblog/issues/17)
- [五子棋AI设计教程第二版八：算杀](https://github.com/lihongxun945/myblog/issues/18)
- [五子棋AI设计教程第二版九：性能优化](https://github.com/lihongxun945/myblog/issues/19)

注意教程中的代码与代码仓库的有一定区别，但原理是一样的。作者本着开源分享的精神，知道的都写出来，没有任何保留，如有遗漏或错误可以提issue。

## 安装使用

此版本已经是编译完成的静态文件，直接部署到Nginx上即可。

- 提示：必须部署到一个Web服务器上，直接打开无法访问。
