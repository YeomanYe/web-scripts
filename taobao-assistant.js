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
    var saveTagArr = function(){
        argArr.forEach(function(arg){
            if(arg.search('ppath=.+') >= 0){
                var tmpArr = arg.replace('ppath=','').split('%');
                for(var i=0,len=tmpArr.length;i<len;i+=2){
                    curTagArr.push(tmpArr[i] +'%'+ tmpArr[i+1]);
                }
            }
        });
        if(curTagArr.length>0)
        localStorage.setItem('preSeaTag',JSON.stringify(curTagArr));
    };
    var searchTags = function(){
        var preTagArr = JSON.parse(localStorage.getItem('preSeaTag'));
        if(!preTagArr) return;
        if(arrayIsEq(curTagArr,preTagArr)) return;
        var tagElms = document.querySelectorAll('.icon-tag.J_Ajax');
        var tagArr = [];
        for(var i=0,len=tagElms.length;i<len;i++){
            tagArr.push(tagElms[i].getAttribute('trace-click'));
        }
        var queryStr = '&cps=yes&ppath=',len = queryStr.length;
        location.search += queryStr + preTagArr.join('%');
        return ;
        preTagArr.forEach(function(str){
            if(tagArr.indexOf('cps:yes_s;ppath:'+str) >= 0)queryStr+=str+'%';
        });
        queryStr = queryStr.substr(0,queryStr.length-1);
        if(queryStr.length !== len - 1)
        location.search += queryStr;
    };
    var arrayIsEq = function(arr1,arr2){
        if(!arr1 || !arr2) return false;
        var len1 = arr1.length,len2 = arr2.length;
        if(len1 !== len2) return false;
        for(var i=0;i<len1;i++){
            if(arr1[i]!==arr2[i])return false;
        }
        return true;
    };
    saveTagArr();
    searchTags();
})();