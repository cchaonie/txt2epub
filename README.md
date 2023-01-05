# txt2epub

A simple tool to convert txt file to epub html files

## Usage

### Install it globally

Install this package globally, so you can use it anywhere.
`npm i txt2epub -g`

### Options

To transform the txt file to html files, you need to specify 3 parameters:

1. sourceFile. The path to your txt file, for example, `./input/hello.txt`.
2. outputDir. The parent directory you want to save your output html files, for example, `./output`.
3. outputName. This will be used as the _title_ of your transformed html files. And it will be the directory name in your _outputDir_ to contain all your output html files. For example, `HELLO`.

So, when you run `txt2epub ./input/hello.txt ./output HELLO`, you will see all your html files in `./output/HELLO`.
