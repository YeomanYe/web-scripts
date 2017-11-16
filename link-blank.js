// ==UserScript==
// @name         超链接从空白标签打开
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  点击超链接从新标签页打开
// @author       Ming Ye
// @match        https://www.google.com/*
// @include      https://www.google.com.pe/*
// @match        https://www.ebay.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    for(var i=0,len=links.length;i<len;i++){
        links[i].setAttribute('target','_blank');
    }
})();