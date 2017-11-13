// ==UserScript==
// @name         导出慕课网笔记
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  导出慕课网的笔记，分为点赞和采集两种
// @author       Ming Ye
// @match        http://www.imooc.com/note/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=229638
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      http://libs.cdnjs.net/FileSaver.js/1.3.3/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var log = consoleFactory('导出笔记脚本:','log',null,true);
    log(saveAs);
    var $btnContainer = $('#main .course-info-main .content-wrap .mod-tab-menu .course-menu');
    var $collectBtn = $('<li><a style="color:orange;cursor:pointer;">采集</a></li>'),//采集按钮
        $praiseBtn = $('<li><a style="color:orange;cursor:pointer;">赞</a></li>');//采集按钮
    $btnContainer.append($collectBtn).append($praiseBtn);
})();