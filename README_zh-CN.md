# txt2epub

一个简单的命令行工具，用于把 `txt` 文件转成 `epub` 文件。

使用其他语言阅读: 简体中文 | [English](./README.md)

## 背景

我有一个朋友，他喜欢看电子书，尤其是网络小说，但是他不喜欢 `txt` 这种格式，因为在手机上看 `txt` 格式的电子书时总是没有封面，这让他很难受。所以我做了这个小工具帮他把 `txt` 文件转换成 `epub` 文件。

## 使用方法

目前，这个工具仅支持中文的转换。

### 全局安装

推荐使用如下命令全局安装这个工具，这样你就可以在你的电脑上的任何一个位置使用它了。

`npm i txt2epub -g`

### 本地安装

通过下面的方式，你可以在你的代码中引入这个工具。

`npm i txt2epub`

然后使用如下代码

```javascript
// for cjs
const { generate } = require('txt2epub');

// for es module
import { generate } from 'txt2epub';
```

### 参数

要把一个 `txt` 文件转成 `epub` 文件，你需要指定以下几个参数：

1. `sourceFile`. **必选**。 你的 `txt` 文件所在的路径, 比如, `hello.txt`。
2. `outputDir`. **必选**。 你想要把转换后的 `epub` 文件输出到哪个目录, 比如, `output`。
3. `title`. **必选**。 你想要把转换后的 `epub` 的标题, 比如, `HELLO`。
4. `outputName`. **可选**。 你想要生成的 `epub` 文件名, 比如, `HELLO`。默认值与 `title` 相同。
5. `coverPath`. **可选**。 你想要生成的 `epub` 文件的封面的路径, 比如, `cover.jpg`。
6. `author`. **可选**。 这个文件的作者, 比如, `Jerry`。

所以，如果你使用如下的命令，

`txt2epub --sourceFile=hello.txt --outputDir=output --title=HELLO`

你就会看到你的 `epub` 的路径就会是这个 `./output/HELLO.epub`。

## 细节

这个工具会基于一些关键字对 `txt` 文件的内容进行章节的分割，这些关键字如下：

1. 一级标题
   1. 前言
   2. 人物简介
   3. 内容简介
   4. 第【序号】卷/集/部
2. 二级标题 1. 第【序号】章|节

其中【序号】可以是阿拉伯数字或者是中文数字。除此之外的内容都会当做正文处理，正文根据 `\r?\n` 进行段落分割。如果你对生成后的 `epub` 文件不满意，你可以使用 `sigil` 这个软件对生成后的 `epub` 文件进一步加工。
