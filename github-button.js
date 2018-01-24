// ==UserScript==
// @name         Github辅助按钮
// @namespace    https://github.com/yeomanye
// @version      0.0.1
// @description  Github下载和复制按钮
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=245345
// @author       Ming Ye
// @match        https://github.com
// @include      https://github.com/*/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */
    let mouseOverHandler = (evt) => {
        // debugTrue();
        let elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.display = 'inline-block';
    }

    let mouseOutHandler = (evt) => {
        // debugTrue();
        let elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.display = 'none';
    }
    
    let log = myDebugger.consoleFactory("github-btn","log",null,true);
    let debugTrue = myDebugger.debugTrue();
    log('github-btn');
    let nodeList = document.querySelectorAll('.octicon.octicon-file');
    for(let i=0,len=nodeList.length;i<len;i++){
        let trElm = nodeList[i].parentNode.parentNode,
            cntElm = trElm.querySelector('.content'),
            aElm = document.createElement('a');
        aElm.innerText = '下载';
        aElm.className = 'fileDownLink';
        aElm.style.cursor = 'pointer';
        aElm.style.display = 'none';
        cntElm.appendChild(aElm);
        log.logObj('tr',trElm);
        trElm.onmouseover=mouseOverHandler;
        trElm.onmouseout=mouseOutHandler;
    }
    

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */