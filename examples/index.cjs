const path = require('node:path');
const fs = require('node:fs');
const { assert } = require('node:console');

const { generate } = require('../lib/index.cjs');

generate({
  sourceFile: path.resolve(__dirname, './txt/input.txt'),
  title: '你好，世界',
  outputDir: path.resolve(__dirname, 'output'),
})
  .then(() => {
    fs.readFile(
      path.resolve(__dirname, 'output/你好，世界.epub'),
      (err, data) => {
        assert(!err);
        assert(data.length > 0);
      }
    );
  })
  .catch((err) => {
    console.error(err);
  });
