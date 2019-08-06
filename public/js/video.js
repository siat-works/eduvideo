var pausetime;
var currenttime;
var firsttime;//第一次快进的世界
var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
var playingtime;
var lasttime;
var isLRKey;//是否触发左右键键盘事件
var actionlist = new Array();
var userid = expdata==null?-1:expdata.phone;
localStorage.setItem("action_record", "");
var server = server_config;


$(document).ready(function () {
    console.log(expdata);
    if (expdata != null) {
        $('#user').text(expdata.phone);
        console.log(expdata);
        if (expdata.videoId == 0) {
            $('#videoPart').attr("src", "for1.mp4");
        } else if (expdata.videoId == 1) {
            $('#videoPart').attr("src", "for2.mp4");
        }
    }
    if (expdata == null || expdata.phone.length == 0) {
        alert("登录后才能完成后续步骤哦");
        $(location).attr("href", "signup.html");
    } else if (expdata.preTest == false) {
        alert("请先完成课前调查");
        $(location).attr("href", "preTest.html");
    } else if (expdata.test==true) {
        alert("您已完成该步骤，请完成课后调查");
        $(location).attr("href", "postTest.html");
    }
});

function signinClick(exdata) {
    if (exdata != null) {
        var msg = "您已登录，确定要注销该账户吗？";
        if (confirm(msg) == true) {
            exdata = null;
            $(location).attr("href", "signup.html");
        }
    } else {
        $(location).attr("href", "signup.html");
    }
    return exdata;
}

$('#user').click(function () {
    expdata = signinClick(expdata);
    window.localStorage.setItem("userInfo", JSON.stringify(expdata));
});


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
    myVideo.addEventListener("playing", firsttimeupdate);//添加视频播放变化的监听
    //myVideo.addEventListener("paused", lasttimeupdate);
    myVideo.addEventListener("play", checkplayed);//添加视频播放监听
    myVideo.addEventListener("pause", checkplayed);//添加视频暂停监听
    myVideo.addEventListener("timeupdate", checktimeupdate);//添加视频进度监听
}

function Actionstroge(id, time, action, sktime) {//存储action和id等数据到localstorage中
    var newaction = {//添加使用的对象
        id: id,
        cur_Time: time,
        cur_action: action,
        skip_time: sktime
    };
    newaction.id = id;
    newaction.cur_Time = time;
    newaction.cur_action = action;
    newaction.skip_time = sktime;
    actionlist.push(newaction);

    localStorage.setItem("action_record", JSON.stringify(actionlist));//存储数据到localstorage中，数据类型为json

    /*var read = JSON.parse(localStorage.getItem('action_record'));
    console.log(read, read.length);*/

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
    console.log(isLRKey);
}

function keyUp(e) {//左右键松开事件
    var keycode = e.which;
    var myVideo = document.getElementById("videoPart");
    if (keycode == 37 || keycode == 39) {
        console.log((document.getElementById("videoPart").currentTime - firsttime) * isLRKey);//键盘左右键快进后退大概多少秒
        if (keycode == 37) {
            Actionstroge(userid, myVideo.currentTime.toString(), "left_start", String(Math.abs(document.getElementById("videoPart").currentTime - firsttime) * isLRKey));
        } else {
            Actionstroge(userid, myVideo.currentTime.toString(), "right_start", String(Math.abs(document.getElementById("videoPart").currentTime - firsttime) * isLRKey));
        }
        isLRKey = 0;
    }
    console.log(isLRKey);
}

function checktimeupdate() {//监控视频播放进度
    var myVideo = document.getElementById("videoPart");
    lasttime = myVideo.currentTime;
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
    Actionstroge(userid, myVideo.currentTime.toString(), state, "null");
}

function firsttimeupdate() {//记录鼠标首次快进或者后退前的时间
    var myVideo = document.getElementById("videoPart");
    //console.log(firsttime);
    var changetime = firsttime - myVideo.currentTime;
    if (changetime > 0) {
        console.log("left");
        Actionstroge(userid, myVideo.currentTime.toString(), "left", String(Math.abs(changetime)));
    } else {
        console.log("right");
        Actionstroge(userid, myVideo.currentTime.toString(), "right", String(Math.abs(changetime)));
    }
    firsttime = myVideo.currentTime;
}
