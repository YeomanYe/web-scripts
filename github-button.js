// ==UserScript==
// @name         Github辅助按钮
// @namespace    https://github.com/yeomanye
// @version      0.0.1
// @description  Github文件下载和复制按钮
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @author       Ming Ye
// @match        https://github.com
// @include      https://github.com/*/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */
    myDebugger.debugD = false;
    let log = myDebugger.consoleFactory("github-btn","log",null);
    let debugTrue = myDebugger.debugTrue;  
    // 初始化函数
    function init(){
        createDownLink();
        createCopyLink();
    }
    //创建下载链接
    function createDownLink(){
        let mouseOverHandler = (evt) => {
        // debugTrue();
        let elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.display = 'inline-block';
        };

        let mouseOutHandler = (evt) => {
            // debugTrue();
            let elem = evt.currentTarget,
                aElm = elem.querySelector('.fileDownLink');
            aElm.style.display = 'none';
        };

        let linkClick = (evt) => {
            let elem = evt.currentTarget;
            var link = document.createElement('a');
            link.setAttribute('href',elem.getAttribute('download-url'));
            link.setAttribute('download',elem.getAttribute('filename'));
            link.click();
        }
        
        let nodeList = document.querySelectorAll('.octicon.octicon-file');
        debugTrue();
        let origin = location.origin,
            href = location.href,
            path = href.replace(origin,'');
        if(path.indexOf('tree')<0)
            path += '/tree/master/';
        path = path.replace('tree','raw');
        for(let i=0,len=nodeList.length;i<len;i++){
            let trElm = nodeList[i].parentNode.parentNode,
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
        let btnGroup = document.querySelector('.file-actions .BtnGroup');
        let aElm = document.createElement('a');
        aElm.href = '#';
        aElm.innerHTML = 'Copy';
        aElm.className = 'btn btn-sm BtnGroup-item copyButton';
        btnGroup.appendChild(aElm);
        let addClickHandler = () => {
            let container = document.querySelector('.js-file-line-container'),
                codeArr = container.querySelectorAll('.js-file-line'),
                text = "";
            for(let code of codeArr){
                text += code.innerText ;
                if(code.innerText.indexOf('\n')<0) text += '\n';
            }
            aElm.setAttribute('data-clipboard-text',text);
            new Clipboard('.copyButton');
            log.logObj('text',text);     
        };
        aElm.onclick = (evt) => {
            clearTimeout(timeout);
            addClickHandler();
            aElm.click();
        }
        let timeout = setTimeout(addClickHandler,1000);
    }
    init();
    
    
    

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */