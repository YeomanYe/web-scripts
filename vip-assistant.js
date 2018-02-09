// ==UserScript==
// @name         唯品会商品浏览助手
// @namespace    https://github.com/yeomanye
// @version      0.1.0
// @description  自动保留唯品会商品浏览的排序方式
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @author       Ming Ye
// @match        https://category.vip.com/search*
// @include      https://category.vip.com/suggest*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = true;
    var log = myDebugger.consoleFactory("vip-assistant","log",null);
    var debugTrue = myDebugger.debugTrue;
    var href = location.href;
    var origin = location.origin;
    var path = location.pathname;
    var search = location.search;
    function orderClickHandler(evt){
        var elm = evt.target;
        var className = elm.className;
        if(className.indexOf('J_sort_option') < 0) return;
        //表示是否用户手动改变了筛选项
        localStorage.setItem('vip-userFilter',true);
    }
    function init(){
        document.body.addEventListener('click',orderClickHandler);
        var flag = localStorage.getItem('vip-userFilter');
        var order,warmup,i,tmpArr;
        //保存用户的筛选条件
        if(flag){
            if(path.indexOf('search') > 0){
                order = path.split('-')[2];
                i = search.indexOf('is_wramup=');
                warmup = search.substr(i+10,1);
                localStorage.setItem('vip-order',order);
                localStorage.setItem('vip-warmup',warmup);
            }else if(path.indexOf('suggest')>0){
                i = search.indexOf('orderId=');
                order = search.substr(i+8,1);
                localStorage.setItem('vip-order',order);
            }
        }else{
            if(path.indexOf('search') > 0){
                order = localStorage.getItem('vip-order');
                warmup = localStorage.getItem('vip-warmup');
                var newHref = origin;
                if(order){
                    tmpArr = path.split('-');
                    newHref += tmpArr[0] + '-' + tmpArr[1] + '-' + order + '-' + tmpArr[3];
                }
                if(warmup){
                    newHref += search.replace(/&is_warmup=.+/,'') + '&is_warmup='+wramup;
                }
                if(origin !== newHref)
                location.href = newHref;
            }else if(path.indexOf('suggest')>0){
                location.search = search.replace(/&orderId=.+&?/,'') + '&orderId='+order;
            }
        }
    }
})();