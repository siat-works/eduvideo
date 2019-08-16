var pausetime;
var currenttime;
var firsttime;//第一次快进的世界
var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
var playingtime;
var lasttime;
var isLRKey;//是否触发左右键键盘事件
var actionlist = new Array();
var actionlist1 = new Array();
var real_time = 0;//计时器计数
var time_keeper;
var userid = expdata == null ? -1 : expdata.phone;
localStorage.setItem("action_record", "");
var time=JSON.parse(localStorage.getItem("time")).time;
console.log(time);
if (time == null || time <= 0) {
    time = 2*10;
}
var server = server_config;
var finished = false;


$(document).ready(function () {
    console.log(expdata);
    if (!expdata.videoFinished){
        $('#next').attr('disabled','true');
        $('#next').css('background-color','gray');
        $('#next').attr('href','#');
    }else {
        $('#next').removeAttr('disabled');
        $('#next').css('background-color','red');
        $('#next').attr('href','test.html');
    }
    data = {online: true};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/video',
        data
    });
    if (expdata != null) {
        $('#user').text(expdata.phone);
        console.log(expdata);
        if (expdata.videoId == 0) {
            $('#videoPart').attr("src", "for1.mp4");
        } else if (expdata.videoId == 1) {
            $('#videoPart').attr("src", "for2.mp4");
        }
        if (expdata.videoFinished) {
            $('#countdown').hide();
        }
    }
    if (expdata == null || expdata.phone.length == 0) {
        alert("登录后才能完成后续步骤哦");
        $(location).attr("href", "index.html");
    } else if (expdata.preTest == false) {
        alert("请先完成课前调查");
        $(location).attr("href", "preTest.html");
    } else if (expdata.test == true) {
        alert("您已完成该步骤，请完成课后调查");
        $(location).attr("href", "postTest.html");
    }
});

window.onbeforeunload = function (e) {
    data = {online: false};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/video',
        data
    });
};

function signinClick(exdata) {
    if (exdata != null) {
        var msg = "您已登录，确定要注销该账户吗？";
        if (confirm(msg) == true) {
            exdata = null;
            $(location).attr("href", "index.html");
        }
    } else {
        $(location).attr("href", "index.html");
    }
    return exdata;
}

$('#user').click(function () {
    expdata = signinClick(expdata);
    window.localStorage.setItem("userInfo", JSON.stringify(expdata));
});

$('#countdown').timeTo({
    seconds: time,
    callback: function () {
        expdata.videoFinished = true;
        window.localStorage.setItem('userInfo', JSON.stringify(expdata));
        $('#next').css('background-color','red');
        $('#next').removeAttr('disabled');
        $('#next').attr('href','test.html');
    },
    step: function () {
        // console.log("完成10s了")
        time-=10;
        window.localStorage.setItem('time',JSON.stringify({time: time}));
    },
    stepCount: 10,
    start: true,
    fontSize: 15,
    captionSize: 15
});

Date.prototype.format = function (fmt) {//将Date()获取的时间转化为正常时间
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
};

function get_storage_useful_time() {//获取有效播放时间
    var i = 0;

    var myVideo = document.getElementById("videoPart");
    var total_useful_time = 0;
    for (i = 0; i < myVideo.played.length; i++) {
        total_useful_time = total_useful_time + myVideo.played.end(i) - myVideo.played.start(i);
    }
    return total_useful_time;
}

window.onload = function () {
    isLRKey = 0;
    var myVideo = document.getElementById("videoPart");
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    //document.onmouseup = mousedown;

    playingtime = myVideo.currentTime;//初始化
    pausetime = myVideo.currentTime;
    currenttime = myVideo.currentTime;

    firsttime = myVideo.currentTime;
    lasttime = myVideo.currentTime;

    localStorage.setItem("action_record", JSON.stringify(actionlist))
    myVideo.addEventListener("playing", firsttimeupdate);//添加视频播放变化的监听
    //myVideo.addEventListener("paused", lasttimeupdate);
    myVideo.addEventListener("play", checkplayed);//添加视频播放监听
    myVideo.addEventListener("pause", checkplayed);//添加视频暂停监听
    myVideo.addEventListener("timeupdate", checktimeupdate);//添加视频进度监听
    
};

function timedCount() {//计时器计数
    real_time = real_time + 1;
    time_keeper = setTimeout("timedCount()",1000)
    console.log(real_time);
}
function stopCount() {//停止计数
    clearTimeout(time_keeper);
}

function get_date_time() {//根据格式获取当前时间
    var now = new Date();
    var time = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ' : ' + now.getMinutes() + ' : ' + now.getSeconds();
    return time;
}

function Actionstroge(id, datetime, time, action, sktime, before) {//存储action和id等数据到localstorage中
    var newaction = {//添加使用的对象
        id: id,
        date_time: datetime,
        cur_Time: time,
        cur_action: action,
        skip_time: sktime
    };
    newaction.id = id;
    newaction.cur_Time = time;
    newaction.date_time = datetime;
    newaction.cur_action = action;
    newaction.skip_time = sktime;
    

    localStorage.setItem("date_time", get_date_time("yyyy-MM-dd"));//存储日期数据到localstorage中
    if (before == 0) {
        actionlist.push(newaction);
        localStorage.setItem("before_action_record", JSON.stringify(actionlist));//存储首次收看视频的行为数据到localstorage中，数据类型为json
    } else {
        actionlist1.push(newaction);
        localStorage.setItem("after_action_record", JSON.stringify(actionlist1));//存储非首次收看视频的行为数据到localstorage中，数据类型为json
    }
}
function keyDown(e) {//左右键按下事件
    var myVideo = document.getElementById("videoPart");
    var keycode = e.which;
    var realkey = String.fromCharCode(e.which);
    if (keycode == 37 && lasttime != myVideo.currentTime) {
        console.log("left");
        //Actionstroge(userid, myVideo.currentTime.toString(), "left_start", "");
        if (isLRKey == 0) {
            firsttime = myVideo.currentTime;
        }
        isLRKey = isLRKey + 1;
    }
    if (keycode == 39 && lasttime != myVideo.currentTime) {
        console.log("right");
        //Actionstroge(userid, myVideo.currentTime.toString(), "right_start", "");
        if (isLRKey == 0) {
            firsttime = myVideo.currentTime;
        }
        isLRKey = isLRKey + 1;
    }
    //console.log(isLRKey);
}

function keyUp(e) {//左右键松开事件
    var keycode = e.which;
    var myVideo = document.getElementById("videoPart");
    if (keycode == 37 || keycode == 39) {
        //console.log((document.getElementById("videoPart").currentTime - firsttime) * isLRKey);//键盘左右键快进后退大概多少秒
        if (keycode == 37) {
            Actionstroge(userid, get_date_time("hh:mm:ss"), myVideo.currentTime.toString(), "left", String(Math.abs(document.getElementById("videoPart").currentTime - firsttime) * isLRKey), localStorage.getItem("isFirst"));
        } else {
            Actionstroge(userid, get_date_time("hh:mm:ss"), myVideo.currentTime.toString(), "right", String(Math.abs(document.getElementById("videoPart").currentTime - firsttime) * isLRKey), localStorage.getItem("isFirst"));
        }
        isLRKey = 0;
    }
    //console.log(isLRKey);
}
function handle_data() {//处理数据
    var i = 0;
    var myVideo = document.getElementById("videoPart");        
    var pasuelist = new Array();
    var playlist = new Array();
    var leftlist = new Array();
    var rightlist = new Array();

    if (localStorage.getItem("isFirst") == 0) {//首次观看视频数据处理
        for (i = 0; i < actionlist.length; i++) {
            //console.log(actionlist[i].cur_action + ": " + actionlist[i].cur_Time);
            switch(actionlist[i].cur_action) {
                case "play":
                    playlist.push(actionlist[i].cur_Time);
                    break;
                case "pause":
                    pasuelist.push(actionlist[i].cur_Time);
                    break;
                case "left":
                    leftlist.push(actionlist[i].cur_Time);
                    break;
                case "right":
                    rightlist.push(actionlist[i].cur_Time);
                    break;
                default:
                    break;
            }
        }
    } else {//非首次观看视频数据处理
        for (i = 0; i < actionlist1.length; i++) {
            //console.log(actionlist[i].cur_action + ": " + actionlist[i].cur_Time);
            switch(actionlist1[i].cur_action) {
                case "play":
                    playlist.push(actionlist1[i].cur_Time);
                    break;
                case "pause":
                    pasuelist.push(actionlist1[i].cur_Time);
                    break;
                case "left":
                    leftlist.push(actionlist1[i].cur_Time);
                    break;
                case "right":
                    rightlist.push(actionlist1[i].cur_Time);
                    break;
                default:
                    break;
            }
        }
    }
    if (rightlist[0] == "0") {//去除首次记录的right的错误
        rightlist.splice(0, 1);
    }
    for (i = 0; i < rightlist.length; i++) {//去除right和play及pause重合错误
        var index = playlist.indexOf(rightlist[i]);
        if (index > -1) {
            playlist.splice(index, 1);
        }
        var index = pasuelist.indexOf(rightlist[i]);
        if (index > -1) {
            pasuelist.splice(index, 1);
        }
    }
    for (i = 0; i < leftlist.length; i++) {//去除left和play及pause重合错误
        var index = playlist.indexOf(leftlist[i]);
        if (index > -1) {
            playlist.splice(index, 1);
        }
        var index = pasuelist.indexOf(leftlist[i]);
        if (index > -1) {
            pasuelist.splice(index, 1);
        }
    }
    console.log(localStorage.getItem("isFirst"))
    if (localStorage.getItem("isFirst") == 0) {//首次观看数据存储
        localStorage.setItem("before_pause_num", pasuelist.length);
        localStorage.setItem("before_left_num", leftlist.length);
        localStorage.setItem("before_right_num", rightlist.length);
        localStorage.setItem("before_useful_time", get_storage_useful_time());
        localStorage.setItem("before_real_time", real_time);
        console.log(localStorage.getItem("before_pause_num"));
    } else {//非首次观看数据存储
        localStorage.setItem("after_pause_num", pasuelist.length);
        localStorage.setItem("after_left_num", leftlist.length);
        localStorage.setItem("after_right_num", rightlist.length);
        localStorage.setItem("after_useful_time", get_storage_useful_time());
        localStorage.setItem("after_real_time", real_time);
        console.log(localStorage.getItem("after_pause_num"));
    }
    console.log(get_storage_useful_time());
}
function checktimeupdate() {//监控视频播放进度
    var myVideo = document.getElementById("videoPart");
    lasttime = myVideo.currentTime;
    //console.log(get_date_time("hh:mm:ss"));
}

function parseTime(time) {//秒化分秒
    time = Math.floor(time);
    var _m, _s;
    _m = Math.floor(time / 60);
    _s = time - _m * 60;
    if (_m < 10) {
        _m = '0' + _m;
    }
    if (_s < 10) {
        _s = '0' + _s;
    }
    return _m + ':' + _s
}

function checkplayed() {//监控是否暂停或者播放
    var myVideo = document.getElementById("videoPart");
    //var state;
    if (myVideo.paused) {
        state = "pause";
    } else {
        state = "play";
    }
    console.log(state);
    Actionstroge(userid, get_date_time("hh:mm:ss"), myVideo.currentTime.toString(), state, "null", localStorage.getItem("isFirst"));
}

function firsttimeupdate() {//记录鼠标首次快进或者后退前的时间
    var myVideo = document.getElementById("videoPart");
    //console.log(firsttime);
    var changetime = firsttime - myVideo.currentTime;
    var flag = 0;
    flag = 0;
    //for (i = 0; i < myVideo.played.length; i++)
        //console.log(Math.abs(myVideo.played.start(i) - myVideo.currentTime).toString());
    if (changetime > 0) {
        console.log("left");
        Actionstroge(userid, get_date_time("hh:mm:ss"), myVideo.currentTime.toString(), "left", String(Math.abs(changetime)), localStorage.getItem("isFirst"));
    } else {
        console.log("right");
        Actionstroge(userid, get_date_time("hh:mm:ss"), myVideo.currentTime.toString(), "right", String(Math.abs(changetime)), localStorage.getItem("isFirst"));
    }
    firsttime = myVideo.currentTime;
}
