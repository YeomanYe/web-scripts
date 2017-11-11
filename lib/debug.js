// ==UserScript==
// @name         debug
// @namespace    https://github.com/yeomanye
// @version      0.5
// @include      *://*
// @description  用于调试的脚本库
// @author       Ming Ye
// ==/UserScript==

// 开启调试
var consoleFactory = function(prefix, type,suffix,debugMode) {
    prefix = prefix || "";
    type = type || "log";
    suffix = suffix || "";
    return function(msg){
        if (debugMode) {
            var arguments = Array.prototype.slice.apply(arguments);
            arguments.unshift(prefix);
            arguments.push(suffix);
            console[type].apply(null,arguments);
        }
    };
};