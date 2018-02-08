// ==UserScript==
// @name         京东搜索助手
// @namespace    https://github.com/yeomanye
// @version      0.0.0
// @description  自动保留京东搜索的筛选条件，点击按钮即可再运用
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @author       Ming Ye
// @match        https://search.jd.com/search?*
// @include        https://search.jd.com/search?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = true;
    var log = myDebugger.consoleFactory("jd-assistant","log",null);
    var debugTrue = myDebugger.debugTrue; 
    var interval;
    var tagClickHandler = function(evt){
        var target = evt.target;
        var targetParentClass = target.parentNode.className;
        var className = target.parentNode.parentNode.className;
        var targetClass = target.className;
        var targetId = target.id;
        debugger;
        if(className.indexOf('J_valueList') < 0 && targetClass.indexOf('J_btnsConfirm') < 0 && targetParentClass.indexOf('crumb-select-item') < 0 && targetId.indexOf('J-toolbar-load-hook') < 0) return;
        //延时，保证能够正确的读取到
        setTimeout(function(){
            var aElms = document.querySelectorAll('.crumb-select-item');
            //没有选中任何标签则返回
            if(aElms.length === 0)return;
            var arr = [];
            for(var i=0,len=aElms.length;i<len;i++){
                var tmpArr = aElms[i].title.split('、');
                for(var j=0,len2=tmpArr.length;j<len2;j++){
                    arr.push(tmpArr[j]);
                }
            }
            log.logObj('arr',arr);
            localStorage.setItem('jd-preSeaTagName',JSON.stringify(arr));
            createTag();
        },600);
    };
    var createTag = function(){
        setTimeout(function(){
            var panel = document.querySelector('.f-sort');
            var target = document.querySelector('.icon-tag.toggle-btn.recover-filter');
            if(target) return;
            var newA = document.createElement('a');
            newA.href = '#';
            newA.innerText = '恢复筛选';
            newA.className = 'icon-tag toggle-btn recover-filter';
            panel.appendChild(newA);
            newA.addEventListener('click',searchTags);
        },1000);
    };
    var init = function(){
        document.body.addEventListener('click',tagClickHandler);
        createTag();
    };
    var searchTags = function(){
        var preTagArr = JSON.parse(localStorage.getItem('jd-preSeaTagName'));
        var tagElms = document.querySelectorAll('.J_valueList a');
        var tagArr = [];
        for(var i=0,len=tagElms.length;i<len;i++){
            tagArr.push(tagElms[i].innerText);
        }
        var queryStr = '&ev=',len = queryStr.length;
        preTagArr.forEach(function(str){
            var index = tagArr.indexOf(str);
            if(index >= 0){
                var tmpArr = tagElms[index].href.split('&');
                tmpArr.forEach(function(str){
                    var i = str.search('ev=.*');
                    if(i>=0) queryStr += str.replace('ev=');
                });
                // queryStr+=tagElms[index].getAttribute('trace-click').replace('cps:yes_s;ppath:','')+'%3B';
            }
        });
        // queryStr = queryStr.substr(0,queryStr.length-3);
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
    init();
})();