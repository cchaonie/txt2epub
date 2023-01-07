"use strict";
exports.__esModule = true;
var constants_1 = require("../../parse/parseTxt/constants");
exports["default"] = (function (pages) {
    return pages.map(function (_a) {
        var title = _a.title, data = _a.data, type = _a.type;
        switch (type) {
            case constants_1.PageType.Section: {
                return {
                    title: title,
                    data: "<h1>".concat(title, "</h1>")
                };
            }
            case constants_1.PageType.Chapter:
            default: {
                return {
                    title: title,
                    data: "<h2>".concat(title, "</h2>").concat(data
                        .map(function (line) { return "<p>".concat(line, "</p>"); })
                        .join(''))
                };
            }
        }
    });
});
