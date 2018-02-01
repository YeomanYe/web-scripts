// ==UserScript==
// @name         Github助手
// @namespace    https://github.com/yeomanye
// @version      0.2.0
// @description  添加Github文件下载、复制按钮
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.pjax/1.1.0/jquery.pjax.min.js
// @author       Ming Ye
// @match        https://github.com
// @include      https://github.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = true;
    var log = myDebugger.consoleFactory("github-btn","log",null);
    var debugTrue = myDebugger.debugTrue;  
    // 初始化函数
    function init(){
        createDownLink();
        createCopyLink();
        bindImgClick();
    }
    //创建下载链接
    function createDownLink(){
        var mouseOverHandler = function(evt){
        // debugTrue();
        var elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.visibility = 'visible';
        };

        var mouseOutHandler = function(evt){
            // debugTrue();
            var elem = evt.currentTarget,
                aElm = elem.querySelector('.fileDownLink');
            aElm.style.visibility = 'hidden';
        };

        var linkClick = function(evt){
            var elem = evt.currentTarget;
            var $link = $('<a></a>');
            $link.attr('href',elem.getAttribute('download-url'));
            $link.attr('download',elem.getAttribute('filename'));
            $link.get(0).click();
        };
        
        var $files = $('.octicon.octicon-file');
        // debugTrue();
        var origin = location.origin,
            href = location.href,
            path = href.replace(origin,'');
        if(path.indexOf('tree')<0)
            path += '/tree/master/';
        path = path.replace('tree','raw');
        $files.each(function(i,fileElm){
            var trElm = fileElm.parentNode.parentNode,
                cntElm = trElm.querySelector('.content'),
                cntA = cntElm.querySelector('a'),
                fileName = cntA.innerText,
                $a = $('<a></a>');
            $a.text('下载');
            $a.attr({class:'fileDownLink','download-url':path+fileName,'filename':fileName});
            $a.css({cursor:'pointer',visibility:'hidden'});
            cntElm.appendChild($a.get(0));
            log.logObj('tr',trElm);
            trElm.onmouseover=mouseOverHandler;
            trElm.onmouseout=mouseOutHandler;
            $a.on('click',linkClick);
        });
    }
    //创建复制链接
    function createCopyLink(){
        var tmpArr = location.href.split('/');
        tmpArr = tmpArr[tmpArr.length-1].split('.');//获取扩展名
        var excludeExts = ['jpg','md','markdown','MD','png'];
        if(tmpArr.length > 1 && excludeExts.indexOf(tmpArr[1]) >= 0) return;
        var $btnGroup = $('.file-actions .BtnGroup');
        if($btnGroup.length == 0)return;
        var $a = $('<a></a>');
        $a.attr({href:'#',class:'btn btn-sm BtnGroup-item copyButton'});
        $a.html('Copy');
        $btnGroup.append($a);
        var addClickHandler = function(){
            var $codes = $('.js-file-line-container .js-file-line'),
                text = "";
            $codes.each(function(index,code){
                log.logObj('code',code);
                text += code.innerText;
                if(code.innerText.indexOf('\n')<0) text += '\n';
            });
            $a.attr('data-clipboard-text',text);
            new Clipboard('.copyButton');
            log.logObj('text',text);     
        };
        $a.one('click',function(evt){
            clearTimeout(timeout);
            addClickHandler();
            $a.click();
        });
        var timeout = setTimeout(addClickHandler,1000);
    }
    //点击图片处理函数
    function bindImgClick(){
        var $imgs = $('article img');
        var newImg = null;
        var $modal = null;
        var width = $(window).width(),height = $(window).height();
        var newImgOnload = function(){
            var imgWidth = newImg.width,imgHeight = newImg.height;
            if(imgWidth > width || imgHeight > height)
            if(height > width){
                newImg.width = width;
            }else{
                newImg.height = height;
            }
            newImg.style.marginLeft = (width - newImg.width)/2 + 'px';
            newImg.style.marginTop = (height - newImg.height)/2 + 'px';
        };
        var initModal = function(){
            $modal = $('<div></div>');
            newImg = new Image();
            $modal.css({position:'fixed',width:width+'px',height:height+'px','background-color':'rgba(0,0,0,0.5)',top:0,left:0,'z-index':-1,'padding-top':0,'padding-left':'auto',visibility:'hidden'});
            $modal.append(newImg);
            $('body').append($modal);
            $modal.one('click',function(e){
                $modal.css({'z-index':-1,'visibility':-1});
            });
        };
        var imgClickHandler = function(e){
            log('imgClickHandler');
            if(!$modal) initModal();
            $modal.css({visibility:'visible','z-index':999});
            var oldImg = e.currentTarget;
            newImg.src = oldImg.src;
            //计算宽高
            newImg.onload = newImgOnload;
        };
        $imgs.each(function(i,img){
            var aElm = img.parentNode;
            aElm.removeAttribute('href');
            var $img = $(img);
            $img.css('cursor','pointer').on('click',imgClickHandler);
        });
    }
    init();
    $(document).on('pjax:success',function(evt){
        log('pjax:success');
        init();
    });
})();