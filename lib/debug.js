// ==UserScript==
// @name         debug
// @namespace    https://github.com/yeomanye
// @version      0.7.0
// @include      *://*
// @description  用于调试的脚本库
// @author       Ming Ye
// ==/UserScript==

(function(context) {
    var debugD = true; //debug默认设置
    //创建分组打印
    var consoleFactory = function(groupName, styleStr, type, debugMode) {
        debugMode = (debugMode === undefined) || debugD;
        type = type || 'log';
        /**
         * 创建的分组打印日志
         * @param  {bool} debugMode 是否启用日志
         */
        var log = function(debugMode) {
            //初始化操作
            log.init();
            if (log.debugMode) {
                var argArr = Array.prototype.slice.apply(arguments);
                console[type].apply(null, argArr);
            }
        }
        /**
         * 初始化操作
         */
        log.init = function(){
            if (!log.nFirst) {
                log.nFirst = true;
                log.debugMode = debugMode;
                log.groupName = log.groupName || groupName;
                if(log.groupNum){
                    while(log.groupNum--)
                        console.groupEnd();
                }
                log.groupNum = 1;
                console.group('%c' + log.groupName, styleStr);
            }
        }
        log.head = function(msg,isClose){
            if(isClose) console.groupEnd();
            console.group('%c'+msg,'font-size:15px')
        }
        /**
         * 打印对象
         * @param  {string} desc 对象描述
         * @param  {object} obj  对象数据
         */
        log.logObj = function(desc, obj, debugMode) {
            log.init();
            debugMode = (debugMode === undefined) || this.debugMode;
            if (debugMode) {
                console.group('%c' + desc, 'color:green;font-size:13px');
                console.log(obj);
                console.groupEnd();
            }
        }
        /**
         * 打印数组
         * @param  {string} desc 数组描述
         * @param  {array} arr  数组类型
         */
        log.logArr = function(desc, arr, debugMode) {
            log.init();
            debugMode = (debugMode === undefined) || this.debugMode;
            if (debugMode) {
                console.group('%c' + desc, 'color:blue;font-size:13px');
                console.table(arr);
                console.groupEnd();
            }
        }
        /**
         * 重置分组日志
         * @param  {string}  groupName 日志名
         * @param  {Boolean} debugMode 是否启用日志
         */
        log.reset = function(groupName, debugMode) {
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
        return log;
    }

    // 当参数为true时开启调试
    var debugTrue = function(debugMode) {
        debugMode = (debugMode === undefined) || debugD;
        return function() {
            if (debugMode) debugger;
        }
    }

    context.myDebugger = {
        consoleFactory: consoleFactory,
        debugTrue: debugTrue
    };

})(window);
