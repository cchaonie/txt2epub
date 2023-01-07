"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
exports["default"] = (function (source) {
    var sectionTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[卷|集]/;
    var pageTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*章/;
    var fileContentInLines = source
        .split(/\r?\n/)
        .filter(function (l) { return !!l; })
        .map(function (l) { return l.trim(); });
    var pages = [];
    var pageData = [];
    var currentPageTitle = '';
    fileContentInLines.forEach(function (line) {
        if (sectionTitlePattern.test(line) || pageTitlePattern.test(line)) {
            // now we see a section or a new page, we should create a new page if `pageData` is not empty
            if (pageData.length) {
                pages.push({
                    title: currentPageTitle,
                    data: pageData,
                    type: currentPageTitle ? constants_1.PageType.Chapter : constants_1.PageType.Other
                });
                pageData = [];
            }
            if (sectionTitlePattern.test(line)) {
                // now we should generate a new section
                pages.push({
                    title: line,
                    data: [line],
                    type: constants_1.PageType.Section
                });
            }
            else {
                currentPageTitle = line;
            }
        }
        else {
            pageData.push(line);
        }
    });
    // Once we add the last page title, we will not have the chance to create a new page for it
    if (pageData.length) {
        pages.push({
            title: currentPageTitle,
            data: pageData,
            type: constants_1.PageType.Chapter
        });
    }
    return pages;
});
