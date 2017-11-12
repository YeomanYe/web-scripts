// ==UserScript==
// @name         电影天堂链接复制
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  电影天堂链接复制按钮
// @author       Ming Ye
// @match        http://www.ygdy8.com/html/gndy/*/*/*
// @include      http://www.ygdy8.net/html/gndy/*/*/*
// @match        http://www.dytt8.net/html/gndy/*/*/*
// @include      http://www.dy2018.com/*/*
// @include      http://www.dygod.net/html/gndy/*/*/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=229638
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var log = consoleFactory('复制链接:','log',null,false);
    var $zoom = $('#Zoom'),
        $container = $zoom.find('table td'), //button容器
        $a = $container.find('a'), //超链接元素
        $btnTemplate = $('<button>复制</button>'); //按钮模板
    $btnTemplate.attr("data-clipboard-action","copy");
    log('循环外');
    for(var i=0,len=$a.length;i<len;i++){
        var $cloneBtn = $btnTemplate.clone().attr({
            'data-clipboard-text':$a.eq(i).text(),
            'class':'btn'
        });
        $container.eq(i).append($cloneBtn);
        log('循环内');
    }
    new Clipboard('.btn');
})();