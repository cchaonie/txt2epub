"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.generateHtmls = exports.generateEpub = void 0;
var generateEpub_1 = require("./generateEpub");
__createBinding(exports, generateEpub_1, "default", "generateEpub");
var generateHtmls_1 = require("./generateHtmls");
__createBinding(exports, generateHtmls_1, "default", "generateHtmls");
