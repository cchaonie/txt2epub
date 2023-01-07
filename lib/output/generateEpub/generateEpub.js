"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var epub_gen_1 = tslib_1.__importDefault(require("epub-gen"));
function generateEpub(_a) {
    var title = _a.title, author = _a.author, content = _a.content, outputDir = _a.outputDir;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var options, error_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
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
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new epub_gen_1["default"](options).promise];
                case 2:
                    _b.sent();
                    console.log('Ebook Generated Successfully!');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Failed to generate Ebook because of ', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = generateEpub;
