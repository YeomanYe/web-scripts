// ==UserScript==
// @name         导出慕课网笔记
// @namespace    https://github.com/yeomanye
// @version      0.1
// @description  导出慕课网的笔记，分为点赞和采集两种
// @author       Ming Ye
// @match        http://www.imooc.com/*/*
// @include      https://www.imooc.com/*/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=232648
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      http://libs.cdnjs.net/FileSaver.js/1.3.3/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var log = window.myDebugger.consoleFactory('慕课网导出笔记脚本:', 'color:brown;font-size:13px'),
        warn = window.myDebugger.consoleFactory('导出笔记脚本:'),
        debugTrue = window.myDebugger.debugTrue(true);
    var $btnContainer = $('#main .course-info-main .content-wrap .mod-tab-menu .course-menu');
    var $collectBtn = $('<li><a style="color:orange;cursor:pointer;">导出笔记</a></li>'), //采集按钮
        $praiseBtn = $('<li><a style="color:orange;cursor:pointer;">赞</a></li>'), //采集按钮
        courseId = window.location.pathname.split("/")[2], //课程ID
        pageNum = 1, //笔记页码
        $iframe = $("<iframe hidden></iframe>"),
        isPause = (localStorage.getItem('collectPause') === "true"), //标志是否停止采集
        baseUrl = window.location.protocol + '//' + window.location.hostname + '/note/' + courseId + '?sort=hot&page=';
    var courseId = window.location.pathname.split("/")[2], //课程ID
        baseUrl = window.location.protocol + '//' + window.location.hostname + '/note/' + courseId + '?sort=hot&page=',
        $html = null,
        pageNum = 1; //笔记页码
    var notes = JSON.parse(localStorage.getItem('notes'));
    $collectBtn.click(fetchNote).appendTo($('#main .course-infos .hd'));
    log('课程ID', courseId);
    log('基准url', baseUrl);
    var isPause = true;
    var noteTimeout = null;

    window.notePateNum = 50;
    /*function fetchNote() {
        do {
            var htmlText = $.ajax({
                url: baseUrl + pageNum,
                async: false
            }).responseText;
            ++pageNum;
            $html = $(htmlText);
            log.logObj('$html', $html);

            var noteIds = getNoteIds($html);
            var noteStatus = getUserNoteStatus(noteIds);
            var colObj = getColObj(noteStatus);
            var dataArr = fetchColContent(colObj.col);
            notes = notes || [];
            for (var i = 0, len = dataArr.length; i < len; i++) {
                notes.push(dataArr[i]);
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            log('pageNum',pageNum);
            if (pageNum > window.notePateNum) {
                break;
            }
        } while ($html.find('#js-note-container').length);
    }*/
    // fetchNote();
    var fetchNote = function (){
        if(noteTimeout) endTimeout(noteTimeout);
        var htmlText = $.ajax({
            url: baseUrl + pageNum,
            async: false
        }).responseText;
        log('pageNum',pageNum);
        ++pageNum;
        // return;
        var pattern = /<ul id="js-note-container" class="mod-post">([\s\S]*)?<\/ul>/g;
        // console.log(htmlText);
        var pattern1 = /<li id="([\d]+)" class="post-row js-find-txt" courseid="[\d]+" noteId="[\d]+" authorid="[\d]+">[\s\S]*?<\/li>/g;
        var matchArr = pattern.exec(htmlText),
            liIds = [],
            liStrArr = [],
            regInput = matchArr[0];
        // log.logObj('regInput',regInput);
        while(matchArr = pattern1.exec(regInput)){
            log.logObj('matchArr',matchArr);
            liIds.push(matchArr[1]);
            liStrArr.push(matchArr[0]);
            // regInput = regInput.replace(matchArr[0],'');
            // log.logObj('regInput',regInput);
        }
        // log('input',matchArr[1].charAt(4));
        log.logObj('liStrArr',liStrArr);
        log.logArr('liIds',liIds);
        /*log('liStrArr[1]',liStrArr[1].replace('<li id="([\\d]+)" class="post-row js-find-txt" courseid="[\\d]+" noteId="([\\d]+)" authorid="[\\d]+">[\\s\\S]*?</li>',''))*/
        // $html = $(htmlText);
        //当查询不到笔记容器id表示已经获取完所有的笔记了;
        // noteTimeout = setTimeout(fetchNote,100);
        return ;
        if(!$html.find('#js-note-container').length)  return;
        log.logObj('$html', $html);
        var flag = false; //笔记成功加载并处理后，才处理下一页

        var noteIds = getNoteIds($html);
        var noteStatus = getUserNoteStatus(noteIds);
        var colObj = getColObj(noteStatus);
        var dataArr = fetchColContent(colObj.col);
        notes = notes || [];
        for (var i = 0, len = dataArr.length; i < len; i++) {
            notes.push(dataArr[i]);
        }
        log('pageNum',pageNum);
        // debugTrue();
        localStorage.setItem('notes', JSON.stringify(notes));
        noteTimeout = setTimeout(window.fetchNote,0);
    }
    fetchNote();
    /**
     * 获取采集对象
     * @param  {array} colArr 采集参照的id数组
     * @return {object}        采集对象
     */
    function fetchColContent(colArr) {
        var retDatas = [];
        for (var i = 0, len = colArr.length; i < len; i++) {
            var $content = $html.find('#' + colArr[i]),
                noteStr = $content.find('.js-notelist-content .autowrap')[0].innerText,
                user = $content.find('.bd .tit')[0].innerText,
                time = $content.find('.footer .timeago')[0].innerText.replace('时间：', ''),
                chapter = $content.find('.footer .from')[0].innerText.replace('源自：', ''),
                data = {
                    note: noteStr,
                    user: user,
                    time: time,
                    chapter: chapter
                };
            retDatas.push(data);
        }
        log.logArr('fetchColContent', retDatas);
        return retDatas;
    }
    /**
     * 使用jsonp方式获取用户对象,获得对象后保存在window.usr中
     */
    function fetchUser() {
        var retStr = $.ajax({
            url: window.location.protocol+'//www.imooc.com/u/card%20?jsonpcallback=getUser&_=' + new Date().getTime(),
            async: false,
        }).responseText;
        log('fetchUser', retStr);
        retStr = retStr.replace('getUser(', '');
        retStr = retStr.substr(0, retStr.length - 1);
        var usr = JSON.parse(retStr);
        log.logObj('fetchUser', usr);
        return usr;
    }
    /**
     * 获取采集的id数组
     * @param  {object} noteStatus 笔记状态对象
     * @return {object}            返回采集和点赞的数组{col:[],pra:[]}
     */
    function getColObj(noteStatus) {
        var tmp = noteStatus.data.collections,
            retObj = {
                col: [],
                pra: []
            };
        for (var i = 0, len = tmp.length; i < len; i++) {
            retObj.col.push(tmp[i].src_note_id);
        }
        tmp = noteStatus.data.praises;
        for (var i = 0, len = tmp.length; i < len; i++) {
            retObj.pra.push(tmp[i].note_id);
        }
        log.logObj('getColIds', retObj);
        return retObj;
    }
    /**
     * 获取笔记id
     * @param  {object} $html 当前页html对象
     * @return {array}       笔记id数组
     */
    function getNoteIds($html) {
        var lis = $html.find('#js-note-container li'),
            ids = [];
        for (var i = 0, len = lis.length; i < len; i++) {
            ids.push(lis.get(i).id);
        }
        log.logArr('ids', ids);
        return ids;
    }
    /**
     * 获取用户笔记状态
     * @param  {array} ids 用户笔记id数组
     * @return {object} 用户笔记操作状态对象
     */
    function getUserNoteStatus(ids) {
        var retStr = $.ajax({
                url: window.location.protocol+'//www.imooc.com/course/AjaxUserNotesStatus?ids=' + ids.join('%2C'),
                async: false
            }).responseText,
            retObj = JSON.parse(retStr);
        log('url',window.location.protocol+'//www.imooc.com/course/AjaxUserNotesStatus?ids=' + encodeURI(ids.join('%2C')));
        log.logObj('getUserNoteStatus', retObj);
        return retObj;
    }
    fetchUser();
    // log('htmlobj',htmlobj.responseText);
    var notes = JSON.parse(localStorage.getItem('notes'));
    function iframeLoadHandler(e) {
        
        var $contDoc = $(this.contentDocument);
        log('contentDocument',this.contentDocument);
        var $collectI = $contDoc.find('#js-note-container .Jcollect i');
        log('$collectI',$collectI);
        log('pageNum',pageNum);
        //如果不存在笔记，则已经到了最后一页
        if($contDoc.find('#course_note .unnote').length) {
            window.isOver = true;
            return;
        }
        var flag = false; //笔记成功加载并处理后，才处理下一页
        log.logArr('$collectI',$collectI);
        
        notes = notes || [];
        for (var i = 0, len = $collectI.length; i < len; i++) {
            flag = true;
            if ($collectI.eq(i).text() == '已采集') {
                var $content = $collectI.eq(i).parents('li.post-row'),
                    noteStr = $content.find('.js-notelist-content .autowrap')[0].innerText,
                    user = $content.find('.bd .tit')[0].innerText,
                    time = $content.find('.footer .timeago')[0].innerText.replace('时间：', ''),
                    chapter = $content.find('.footer .from')[0].innerText.replace('源自：', ''),
                    data = {
                        note: noteStr,
                        user: user,
                        time: time,
                        chapter: chapter
                    };
                log('data', data);
                if (!hasData(notes, data)) notes.push(data);
            }
        }
        pageNum = parseInt((localStorage.getItem('pageNum')));
        pageNum = pageNum ? (pageNum + 1) : 2;
        log(pageNum);
        if (true/*flag && !isPause*/) {
            localStorage.setItem('notes', JSON.stringify(notes));
            localStorage.setItem('pageNum', pageNum);
            this.src = baseUrl + pageNum;
        }
    }
    /**
     * 查看notes数组中是否含有该条数据，
     * 因为数据不断往后加载，所以只要比较最后一条即可
     */
    function hasData(notes, data) {
        if (!notes || !notes.length) return false;
        /*var note = notes[notes.length - 1];
        if(note.note !== data.note) return false;
        if(note.user !== data.user) return false;
        if(note.time !== data.time) return false;
        if(note.chapter !== data.chapter) return false;*/
        for (var i = 0, len = notes.length; i < len; i++) {
            if (notes[i].note != data.note) return false;
        }
        return true;
    }
    /*log('isOver',window.isOver);
    if(window.isOver) return;
    log('pageNum',pageNum);
    $iframe[0].onload = iframeLoadHandler;

    $collectBtn.click(function(){
        isPause = true;
        localStorage.setItem('collectPause',!isPause);
    });
    $btnContainer.append($collectBtn);
    $('body').append($iframe);
    $iframe[0].src = baseUrl + pageNum;*/
})();