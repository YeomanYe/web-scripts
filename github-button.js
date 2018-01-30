// ==UserScript==
// @name         Github辅助按钮
// @namespace    https://github.com/yeomanye
// @version      0.0.2
// @description  Github文件下载和复制按钮
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
    }
    //创建下载链接
    function createDownLink(){
        var mouseOverHandler = function(evt){
        // debugTrue();
        var elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.display = 'inline-block';
        };

        var mouseOutHandler = function(evt){
            // debugTrue();
            var elem = evt.currentTarget,
                aElm = elem.querySelector('.fileDownLink');
            aElm.style.display = 'none';
        };

        var linkClick = function(evt){
            var elem = evt.currentTarget;
            var link = document.createElement('a');
            link.setAttribute('href',elem.getAttribute('download-url'));
            link.setAttribute('download',elem.getAttribute('filename'));
            link.click();
        };
        
        var nodeList = document.querySelectorAll('.octicon.octicon-file');
        // debugTrue();
        var origin = location.origin,
            href = location.href,
            path = href.replace(origin,'');
        if(path.indexOf('tree')<0)
            path += '/tree/master/';
        path = path.replace('tree','raw');
        for(var i=0,len=nodeList.length;i<len;i++){
            var trElm = nodeList[i].parentNode.parentNode,
                cntElm = trElm.querySelector('.content'),
                cntA = cntElm.querySelector('a'),
                fileName = cntA.innerText,
                aElm = document.createElement('a');
            aElm.innerText = '下载';
            aElm.className = 'fileDownLink';
            aElm.style.cursor = 'pointer';
            aElm.style.display = 'none';
            aElm.setAttribute('download-url',path+fileName);
            aElm.setAttribute('filename',fileName);
            cntElm.appendChild(aElm);
            log.logObj('tr',trElm);
            trElm.onmouseover=mouseOverHandler;
            trElm.onmouseout=mouseOutHandler;
            aElm.onclick = linkClick;
        }
    }
    //创建复制链接
    function createCopyLink(){
        var btnGroup = document.querySelector('.file-actions .BtnGroup');
        var aElm = document.createElement('a');
        if(!btnGroup)return;
        aElm.href = '#';
        aElm.innerHTML = 'Copy';
        aElm.className = 'btn btn-sm BtnGroup-item copyButton';
        btnGroup.appendChild(aElm);
        var addClickHandler = function(){
            var container = document.querySelector('.js-file-line-container'),
                codeArr = container.querySelectorAll('.js-file-line'),
                text = "";
            for(var code of codeArr){
                text += code.innerText ;
                if(code.innerText.indexOf('\n')<0) text += '\n';
            }
            aElm.setAttribute('data-clipboard-text',text);
            new Clipboard('.copyButton');
            log.logObj('text',text);     
        };
        aElm.onclick = function(evt){
            clearTimeout(timeout);
            addClickHandler();
            aElm.click();
        };
        var timeout = setTimeout(addClickHandler,1000);
    }
    init();
    $(document).on('pjax:success',function(evt){
        log('pjax:success')
        init();
    });
    log.logObj('$',$);
})();