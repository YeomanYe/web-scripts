// ==UserScript==
// @name         淘宝搜索助手
// @namespace    https://github.com/yeomanye
// @version      0.1.0
// @description  保留淘宝搜索的筛选条件并自动运用
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @author       Ming Ye
// @match        https://s.taobao.com/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = true;
    var log = myDebugger.consoleFactory("taobao-assistant","log",null);
    var debugTrue = myDebugger.debugTrue; 
    var searchStr = location.search;
    var argArr = searchStr.split('&');
    var curTagArr = [];
    argArr.forEach(function(arg){
        if(arg.indexOf('ppath') >= 0){
            var tmpArr = arg.split('%');
            for(var i=0,len=tmpArr.length;i<len;i+=2){
                curTagArr.push(tmpArr[i] + tmpArr[i+1]);
            }
        }
    });
    if(curTagArr.length>0)
    localStorage.setItem('preSeaTag',JSON.stringify(curTagArr));
})();