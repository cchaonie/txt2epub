"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var helpers_1 = require("./helpers");
exports["default"] = (function (_a) {
    var outputDir = _a.outputDir, content = _a.content;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var outputContent;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!Array.isArray(content)) {
                        outputContent = [content];
                    }
                    else {
                        outputContent = content;
                    }
                    return [4 /*yield*/, Promise.all(outputContent.map(function (content, i) {
                            return (0, helpers_1.writeHtml)(outputDir, content, "page_".concat(i + 1));
                        }))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
