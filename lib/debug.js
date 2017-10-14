// ==UserScript==
// @name         debug
// @namespace    https://github.com/yeomanye
// @version      0.4
// @include      *://*
// @description  用于调试的脚本库
// @author       Ming Ye
// ==/UserScript==

// 开启调试
var debugMode = true;
var consoleFactory = function(prefix, type,suffix) {
    prefix = prefix || "";
    type = type || "log";
    suffix = suffix || "";
    return function(msg){
        if (window.debugMode) {
            console[type](prefix, msg,suffix);
        }
    };
};