# txt2epub

A simple command line tool to convert txt file to epub html files.

Read this in other languages: English | [简体中文](./README_zh-CN.md)

## Background

I have a friend, he loves reading ebooks, especially novels, but he does not like the `txt` format because when a `txt` ebook is put into a smart phone, it does not have a nice cover. So I create this little tool to help him to transform a `txt` file to `epub` file.

## Usage

Currently, this tool only supports the Chinese text transformation.

### Install it globally

Install this package globally, so you can use it anywhere.

`npm i txt2epub -g`

### Options

To transform a txt file into an epub file, you need to specify 5 parameters:

1. sourceFile. **Required**. The path to your txt file, for example, `hello.txt`.
2. targetFolder. **Required**. The directory you want to save your output epub file, for example, `./output`.
3. targetName. **Required**. This will be used as the _title_ of your epub file, for example, `HELLO`.
4. coverPath. **Optional**. This is the path to your cover image, for example, `./cover.jpg`.
5. author. **Optional**. The author of the book, for example, `Jerry`.

So, when you run

`txt2epub --sourceFile=hello.txt --targetFolder=output --targetName=HELLO`

You will see your epub file in `./output/HELLO.epub`.
