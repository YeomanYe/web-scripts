// ==UserScript==
// @name         电影天堂链接复制
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  电影天堂链接复制按钮
// @author       Ming Ye
// @match        http://www.ygdy8.com/html/gndy/jddy/*/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=223801
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var zoom = $('#Zoom');
    var buttonContainer = zoom.find('strong:contains("【下载地址】")'),
        linkArch = zoom.find('table td a');
    console.log(buttonContainer,linkArch);
})();