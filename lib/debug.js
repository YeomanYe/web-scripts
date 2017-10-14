// 调试模式
var debugMode = true;
var debugFactory = function(prefix, type,suffix) {
    prefix = prefix || "";
    type = type || "log";
    suffix = suffix || "";
    return function(msg){
        if (window.debugMode) {
            console[type](prefix, msg,suffix);
        }
    };
};