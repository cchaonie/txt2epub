# txt2epub

A simple command line tool to convert txt file to epub html files

## Usage

### Install it globally

Install this package globally, so you can use it anywhere.

`npm i txt2epub -g`

### Options

To transform a txt file into an epub file, you need to specify 3 parameters:

1. sourceFile. The path to your txt file, for example, `./input/hello.txt`.
2. outputDir. The directory you want to save your output epub file, for example, `./output`.
3. outputName. This will be used as the _title_ of your epub file.

So, when you run `txt2epub ./input/hello.txt ./output HELLO`, you will see all your html files in `./output/HELLO.epub`.
