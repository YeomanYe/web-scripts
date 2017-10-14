// ==UserScript==
// @name         漫画翻页脚本
// @namespace    https://github.com/yeomanye
// @version      0.4.2
// @description  KuKu漫画网站点击漫画图片进行翻页的脚本
// @author       Ming Ye
// @homepage     https://greasyfork.org/zh-CN/scripts/33966-%E6%BC%AB%E7%94%BB%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC
// @supportURL   https://greasyfork.org/zh-CN/scripts/33966-%E6%BC%AB%E7%94%BB%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC/feedback
// @match        http://comic.kukudm.com/comiclist/*
// @include      http://comic2.kukudm.com/comiclist/*
// @include      http://comic3.kukudm.com/comiclist/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=223801
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 开启调试
    window.debugMode = false;
    var debugFun = consoleFactory("KuKu动漫点击翻页脚本：","log");
    // 获取总页数
    var getTotalPage = function(str) {
        var rep1 = "|",
            rep2 = /共(\d.)页/g;
        return rep2.exec(str.split(rep1)[1])[1];
    };
    // 图片点击处理事件
    var imgClickHandler = function(e) {
        var img = e.currentTarget,
            mouseX = e.clientX,
            clientWidth = window.innerWidth, // 可视宽高
            curLink = location.href, // 本页链接
            reg = "/",
            arr = curLink.split(reg), // 分割url后的数组
            jumpLink, // 跳转链接
            curPage = arr[arr.length - 1], //当前页
            suffix = curPage.split(".")[1], //文件后缀
            pageNum = Number.parseInt(curPage), //页码
            totalPage = getTotalPage(img.parentNode.innerText); // 获取总页数

        if (mouseX > clientWidth / 2) {
            jumpLink = curLink.replace(curPage, pageNum + 1 + "." + suffix);
            if (pageNum >= totalPage) {
                jumpLink = curLink.replace(arr[arr.length - 2] + "/" + arr[arr.length - 1], "");
            }
        } else {
            if (pageNum <= 1) return;
            jumpLink = curLink.replace(curPage, pageNum - 1 + "." + suffix);
        }
        window.top.location.href = jumpLink;
    };

    var imgs = document.getElementsByTagName("img"),
        title = document.title.split(" ")[0];
    for (var i = 0, len = imgs.length; i < len; i++) {
        var img = imgs[i],
            url = decodeURI(img.src);
        if (url.indexOf(title) >= 0) {
            debugFun(img);
            img.onclick = imgClickHandler;
        }
    }
})();