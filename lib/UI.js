// ==UserScript==
// @name         UI
// @namespace    https://github.com/yeomanye
// @version      0.2.1
// @include      *://*
// @description  界面库调用接口
// @author       Ming Ye
// ==/UserScript==

(function(context) {
    var TIME_SHORT = 1000;
    var tipsCss = {
        position: 'fixed',
        padding: '20px',
        transform: 'translate(-50%,-50%)',
        'font-size': '18px',
        'z-index': 999,
        background: 'black',
        color: 'white'
    };
    var tipsCssStyle = genderStyle(tipsCss);
    function genderStyle(cssObj){
        var cssKeys = Object.keys(cssObj),cssVals = Object.values(cssObj);
        var styleStr = '';
        for(var i=0,len=cssKeys.length;i<len;i++){
            var key = cssKeys[i],val = cssVals[i];
            styleStr += key+': '+val+';'
        }
        return styleStr
    }
    context.showTips = function(msg, time) {
        var width = window.innerWidth,
            height = window.innerHeight;
        time = time ? time : TIME_SHORT;
        var divElm = document.createElement('div');
        divElm.innerText = msg;
        divElm.setAttribute('style', tipsCssStyle);
        divElm.style.top = height / 2 + 'px';
        divElm.style.left = width / 2 + 'px';
        document.body.appendChild(divElm);
        setTimeout(function() {
            divElm.parentNode.removeChild(divElm);
        }, time);
    };
})(window);