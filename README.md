# txt2epub

A simple command line tool to convert txt file to epub html files.

## Caution

Only text in `utf-8` is supported, if your txt file is encoded with other format, for example, `ANSI` in Windows system. You should transform it to `utf-8` first.

## Usage

Currently, this tool only supports the Chinese text transformation.

### Install it globally

Install this package globally, so you can use it anywhere.

`npm i txt2epub -g`

### Options

To transform a txt file into an epub file, you need to specify 5 parameters:

1. sourceFile. **Required**. The path to your txt file, for example, `hello.txt`.
2. outputDir. **Required**. The directory you want to save your output epub file, for example, `./output`.
3. outputName. **Required**. This will be used as the _title_ of your epub file, for example, `HELLO`.
4. coverPath. **Optional**. This is the path to your cover image, for example, `./cover.jpg`.
5. author. **Optional**. The author of the book, for example, `Jerry`.

So, when you run

`txt2epub hello.txt ./output HELLO ./cover.jpg Jerry`

You will see all your html files in `./output/HELLO.epub`.
