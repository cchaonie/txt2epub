"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var epub_gen_1 = tslib_1.__importDefault(require("epub-gen"));
function generateEpub(_a) {
    var title = _a.title, author = _a.author, content = _a.content, outputDir = _a.outputDir;
    var options = {
        title: title,
        lang: 'zh',
        cover: '',
        tocTitle: title,
        appendChapterTitles: false,
        author: author,
        content: content,
        output: "".concat(outputDir, "/").concat(title, ".epub"),
        publisher: '',
        verbose: true
    };
    new epub_gen_1["default"](options).promise.then(function () { return console.log('Ebook Generated Successfully!'); }, function (err) { return console.error('Failed to generate Ebook because of ', err); });
}
exports["default"] = generateEpub;
