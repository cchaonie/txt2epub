"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var promises_1 = tslib_1.__importDefault(require("fs/promises"));
var path_1 = tslib_1.__importDefault(require("path"));
function writeHtml(outputDir, content, filename) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fileHandle;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1["default"].open(path_1["default"].resolve(outputDir, "".concat(filename, ".html")), 'w')];
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
exports["default"] = writeHtml;
