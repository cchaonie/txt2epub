"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var promises_1 = tslib_1.__importDefault(require("fs/promises"));
var path_1 = tslib_1.__importDefault(require("path"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
function parseContent(filePath, outputName) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pages, moduleDirPath, pageTemplatePath, sectionTemplatePath, sectionTitlePattern, pageTitlePattern, fileContent, pageTemplate, sectionTemplate, currentTitle, currentContent, fileContentInLines, pageContent;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pages = [];
                    moduleDirPath = path_1["default"].dirname(__filename);
                    pageTemplatePath = path_1["default"].resolve(moduleDirPath, '../templates/page.html');
                    sectionTemplatePath = path_1["default"].resolve(moduleDirPath, '../templates/section.html');
                    sectionTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[卷|集]/;
                    pageTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*章/;
                    return [4 /*yield*/, promises_1["default"].readFile(filePath, {
                            encoding: 'utf-8'
                        })];
                case 1:
                    fileContent = _a.sent();
                    return [4 /*yield*/, promises_1["default"].readFile(pageTemplatePath, {
                            encoding: 'utf-8'
                        })];
                case 2:
                    pageTemplate = _a.sent();
                    return [4 /*yield*/, promises_1["default"].readFile(sectionTemplatePath, {
                            encoding: 'utf-8'
                        })];
                case 3:
                    sectionTemplate = _a.sent();
                    currentTitle = outputName;
                    currentContent = [];
                    fileContentInLines = fileContent
                        .split(/\r?\n/)
                        .filter(function (l) { return !!l; })
                        .map(function (l) { return l.trim(); });
                    lodash_1["default"].each(fileContentInLines, function (line) {
                        if (sectionTitlePattern.test(line) || pageTitlePattern.test(line)) {
                            // now we see a section or a new page, we should create a new page if `currentContent` is not empty
                            if (currentContent.length) {
                                var pageContent = pageTemplate
                                    .replace('{{title}}', currentTitle)
                                    .replace('{{content}}', currentTitle === outputName
                                    ? "<h1>".concat(currentTitle, "</h1>")
                                    : "<h2>".concat(currentTitle, "</h2>") + currentContent.join(''));
                                pages.push(pageContent);
                                currentContent = [];
                            }
                            if (sectionTitlePattern.test(line)) {
                                // now we should generate a new section
                                var sectionContent = sectionTemplate
                                    .replace('{{title}}', line)
                                    .replace('{{section}}', "<h1>".concat(line, "</h1>"));
                                pages.push(sectionContent);
                            }
                            else {
                                currentTitle = line;
                            }
                        }
                        else {
                            currentContent.push("<p>".concat(line, "</p>"));
                        }
                    });
                    // Once we add the last page title, we will not have the chance to create a new page for it
                    if (currentContent.length) {
                        pageContent = pageTemplate
                            .replace('{{title}}', currentTitle)
                            .replace('{{content}}', "<h2>".concat(currentTitle, "</h2>") + currentContent.join(''));
                        pages.push(pageContent);
                    }
                    return [2 /*return*/, pages];
            }
        });
    });
}
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
function generatePage(outputDir, pages) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var i;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < pages.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, writeToDisk(outputDir, pages[i], i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function writeToDisk(outputDir, content, index) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fileHandle;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1["default"].open(path_1["default"].resolve(outputDir, "page_".concat(index, ".html")), 'w')];
                case 1:
                    fileHandle = _a.sent();
                    return [4 /*yield*/, fileHandle.writeFile(content)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fileHandle.close()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generate(_a) {
    var inputFilePath = _a.inputFilePath, outputName = _a.outputName, outputDir = _a.outputDir;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pages, targetDir;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, parseContent(inputFilePath, outputName)];
                case 1:
                    pages = _b.sent();
                    console.log('Parse content successfully');
                    targetDir = path_1["default"].resolve(outputDir, outputName);
                    return [4 /*yield*/, createFolder(targetDir)];
                case 2:
                    _b.sent();
                    console.log('Create target directory successfully');
                    return [4 /*yield*/, generatePage(targetDir, pages)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = generate;