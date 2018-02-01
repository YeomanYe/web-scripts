// ==UserScript==
// @name         Greasy 助手
// @namespace    https://github.com/yeomanye
// @version      0.1.0
// @description  添加
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @author       Ming Ye
// @match        https://greasyfork.org/*/users/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = true;
    var log = myDebugger.consoleFactory("greasy-assistant","log",null);
    var debugTrue = myDebugger.debugTrue; 
    log.logObj('$',$);
    var $as = $('article h2 a');
    var urlMap = {};
    var href = location.href;
    $as.each(function(i,a){
        var $a = $as.eq(i);
        var key = $a.text(),aHref = $a.attr('href');
        var tmpArr = aHref.split('/');
        tmpArr = tmpArr[tmpArr.length-1].split('-');
        var val = aHref.replace(tmpArr[1],'').replace('users','scripts');
        val = href+val.substr(0,val.length-1) + '/versions/new';
        urlMap[key] = val;
    });
    log.logObj('urlMap',urlMap);
})();