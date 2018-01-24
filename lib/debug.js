// ==UserScript==
// @name         debug
// @namespace    https://github.com/yeomanye
// @version      0.9
// @include      *://*
// @description  用于调试的脚本库
// @author       Ming Ye
// ==/UserScript==

(function(context) {
    var debugD = true; //debug默认设置
    var myDebugger = {
        consoleFactory: consoleFactory,
        debugTrue: debugTrue,
        debugD:debugD
    };
    //创建分组打印
    var consoleFactory = function(groupName, styleStr, type, debugMode) {
        debugMode = (debugMode === undefined) || myDebugger.debugD;
        type = type || 'log';
        /**
         * 创建的分组打印日志
         * @param  {bool} debugMode 是否启用日志
         */
        var log = function() {
            //初始化操作
            log.init();
            if (log.debugMode) {
                var argArr = Array.prototype.slice.apply(arguments);
                console[type].apply(null, argArr);
            }
        }
        log.debugMode = debugMode;
        /**
         * 初始化操作
         */
        log.init = function(){
            if (!log.nFirst) {
                log.nFirst = true;
                log.groupName = log.groupName || groupName;
                console.group('%c' + log.groupName, styleStr);
            }
        }
        /**
         * 打印对象
         * @param  {string} desc 对象描述
         * @param  {object} obj  对象数据
         */
        log.logObj = function(desc, obj) {
            log.init();
            if (this.debugMode) {
                var argArr = [].slice.call(arguments);
                var desc = argArr.shift();
                argArr.unshift('color:green');
                argArr.unshift(`%c[${desc}]`);

                console.log.apply(console,argArr);
            }
        }
        /**
         * 打印数组
         * @param  {string} desc 数组描述
         * @param  {array} arr  数组类型
         */
        log.logArr = function(desc, arr) {
            log.init();
            if (this.debugMode) {
                var argArr = [].slice.call(arguments);
                var desc = argArr.shift();
                console.group(`%c[${desc}]`, 'color:blue;font-size:13px');
                argArr.forEach(item=>{
                    console.table(item);
                });
                console.groupEnd();
            }
        }
        /**
         * 重置分组日志
         * @param  {string}  groupName 日志名
         * @param  {Boolean} debugMode 是否启用日志
         */
        log.reset = function(groupName, debugMode) {
            console.groupEnd();
            log.nFirst = false;
            log.debugMode = (debugMode === undefined) || true;
            log.groupName = groupName || this.groupName;
        }
        /**
         * 断言
         * @param  {bool} expr      表达式
         * @param  {string} msg       消息
         * @param  {bool} debugMode 是否启用
         */
        log.assert = function(expr,msg,debugMode){
            debugMode = (debugMode === undefined) || this.debugMode;
            if(debugMode){
                console.assert(expr,msg);
            }
        }
        /**
         * 强调 用于突出显示的场合
         * @param  {string} desc    强调内容
         * @param  {string} bgColor 颜色
         */
        log.em = function(desc, bgColor) {
            log.init();
            bgColor = bgColor || 'green';
            if (debugMode) {
                console.log(`%c${desc}`, `font-size:18px;background-color:${bgColor};color:white;padding:4px`);
            }
        }
        return log;
    }

    // 当参数为true时开启调试
    var debugTrue = function(debugMode) {
        debugMode = (debugMode === undefined) || myDebugger.debugD;
        return function() {
            if (debugMode) debugger;
        }
    }

    context.myDebugger = myDebugger;

})(window);
