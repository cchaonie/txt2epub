"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var generate_1 = tslib_1.__importDefault(require("./generate"));
var _a = process.argv, sourceFile = _a[2], targetFolder = _a[3], targetName = _a[4];
var cwd = process.cwd();
(0, generate_1["default"])({
    inputFilePath: path_1["default"].resolve(cwd, sourceFile),
    outputName: targetName,
    outputDir: path_1["default"].resolve(cwd, targetFolder)
})
    .then(function () { return 'Successful'; })["catch"](function (e) { return console.error('Failed:', e); });
