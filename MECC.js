// ==UserScript==
// @name         MECC助手
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  MECC
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.pjax/1.1.0/jquery.pjax.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @author       Ming Ye
// @match        http://qtb.mecc.world/trade/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    debugger;
    var $link = $('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css"/>');
    $link.appendTo('body');
    var $style = $('<style>');
    $style.text(' label, input { display:block; }input.text { margin-bottom:12px; width:95%; padding: .4em; }fieldset { padding:0; border:0; margin-top:25px; }.ui-dialog{overflow:hidden;}');
    $style.appendTo('body');
    var $msgDialog = $('<div id="msgDialog" title="消息"><p id="msgBox"></p></div>');
    $msgDialog.appendTo('body');
    var dialogStr = ['<div id="dialog" title="MECC助手">',
        '  <form>',
        '    <fieldset>',
        '      <label >数量</label>',
        '      <input type="text" id="dNumber" class="text ui-widget-content ui-corner-all">',
        '      <label >单价</label>',
        '      <input type="text" id="dPrice" class="text ui-widget-content ui-corner-all">',
        '      <label >差价</label>',
        '      <input value="0.01" typ="text" id="dPriceDiff" class="text ui-widget-content ui-corner-all">',
        ' ',
        '    </fieldset>',
        '  </form>',
        '</div>'
    ].join("");
    $(dialogStr).appendTo('body');

    var $span = $('<span style="cursor:pointer;background:#ccc;color:white;display:inline-block;padding:15px 20px;font-size:20px;border-radius:5px;position:fixed;top:50px;left:20px;">');
    $span.text('挂');
    $span.appendTo('body');
    $span.on('click', function() {
        var disVal = $('.ui-dialog').css('display');
        if (disVal === 'none') dialog.dialog('open');
        else dialog.dialog('close');
        if(timeout)clearTimeout(timeout);
    });
    var autoOpen = true;
    var meccTrade = JSON.parse(localStorage.getItem('mecc-trade'));
    var timeout, meccNum, price, diff, _;
    var baseUrl = 'http://qtb.mecc.world/member/meccTrade/mecc_sell.jhtml';
    var param;
    var complete = function(data) {
        try {
            var str = data.responseText;
            data = JSON.parse(str);
        } catch (e) {
            console.log('e', e);
        }
        var meccTrade = JSON.parse(localStorage.getItem('mecc-trade'));
        var leftMecc = localStorage.getItem('leftMecc');
        var curMecc = getCurMeccValue();
        if (data && data.status && leftMecc !== curMecc) {
            if(meccTrade.meccNum < 200)
                meccTrade.meccNum = 0;
            else meccTrade.meccNum = meccTrade.meccNum - 200;
            localStorage.setItem('mecc-trade', JSON.stringify(meccTrade));
            price = meccTrade.price
            if(meccTrade.meccNum === 0) {
                // '售出价格：' + meccTrade.price + ',售出数量：' + meccTrade.meccNum
                $('#msgBox').text('操作成功');
                $('#msgDialog').dialog();
                $span.text('挂');
                localStorage.removeItem('leftMecc');
                return;
            }
            localStorage.setItem('leftMecc',curMecc);
        }else price = parseFloat((meccTrade.price + meccTrade.diff).toFixed(2));
        //保存便于下次请求
        meccTrade.price = price;
        localStorage.setItem('mecc-trade', JSON.stringify(meccTrade));
        meccNum = meccTrade.meccNum;
        meccNum = meccNum > 200 ? 200 : meccNum;
        param = '?isTrade=1&price=' + price + '&meccNum=' + meccNum + '&_=' + meccTrade._;
        var url = baseUrl + param;
        timeout = setTimeout(function() {
            $.ajax(url, {
                complete: complete
            });
        }, 0);
        /*$.ajax(url, {
                complete: complete
            });*/
        console.log('url', url, 'data', data);
    };
    var getCurMeccValue = function() {
        var htmlText = $.ajax('http://qtb.mecc.world/trade/index.jhtml',{async:false}).responseText;
        var matches = htmlText.match(/可用MECC：([\d.]+?)</);
        if(matches && matches[1]){
            return parseInt(matches[1],10) + '';
        }
        return;
    }
    var req = function(url) {
        $span.text('···');
        var leftMecc = localStorage.getItem('leftMecc');
        if(!leftMecc) {
             leftMecc = getCurMeccValue();
             localStorage.setItem('leftMecc',leftMecc);
        }
        if ((new Date()).getHours() >= 10)
            $.ajax(url, {
                complete: complete
            })
        else {
            console.log('未到时间，等待中...');
            while(true){
                req(url);
            }
            /*timeout = setTimeout(function() {
                req(url);
            }, 0);*/
        }
    }
    //八个小时之内都不再进行设置
    if (meccTrade && meccTrade.meccNum > 0 && Date.now() - meccTrade._ < 60 * 1000 * 60 * 8) {
        autoOpen = false;
        meccNum = meccTrade.meccNum;
        meccNum = meccNum > 200 ? 200 : meccNum;

        param = '?isTrade=1&price=' + meccTrade.price + '&meccNum=' + meccNum + '&_=' + meccTrade._;
        req(baseUrl + param);
    }
    var dialog = $("#dialog").dialog({
        autoOpen: false,
        buttons: {
            "确定": function() {
                meccNum = parseInt($('#dNumber').val());
                price = parseFloat($('#dPrice').val());
                diff = parseFloat($('#dPriceDiff').val());
                _ = Date.now();
                var meccTrade = {
                    meccNum: meccNum,
                    diff: diff,
                    price: price,
                    _: _
                };
                meccNum = meccNum > 200 ? 200 : meccNum;
                param = '?isTrade=1&price=' + price + '&meccNum=' + meccNum + '&_=' + _;
                localStorage.setItem('mecc-trade', JSON.stringify(meccTrade));
                req(baseUrl + param);
                dialog.dialog("close");
            },
            "取消": function() {
                dialog.dialog("close");
            }
        },
    });
})();