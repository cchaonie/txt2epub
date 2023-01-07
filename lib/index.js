"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var promises_1 = tslib_1.__importDefault(require("fs/promises"));
var parse_1 = require("./parse");
var transform_1 = require("./transform");
var output_1 = require("./output");
function createFolder(folderPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1["default"].mkdir(folderPath, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generate(_a) {
    var inputFilePath = _a.inputFilePath, outputName = _a.outputName, outputDir = _a.outputDir;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fileContent, pages, epubPages;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1["default"].readFile(inputFilePath, {
                        encoding: 'utf-8'
                    })];
                case 1:
                    fileContent = _b.sent();
                    pages = (0, parse_1.parseTxt)(fileContent);
                    console.log('Parse content successfully');
                    epubPages = (0, transform_1.transformToHtml)(pages);
                    return [4 /*yield*/, createFolder(outputDir)];
                case 2:
                    _b.sent();
                    console.log('Create target directory successfully');
                    return [4 /*yield*/, (0, output_1.generateEpub)({
                            outputDir: outputDir,
                            content: epubPages,
                            title: outputName
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = generate;
