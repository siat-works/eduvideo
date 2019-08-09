var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
answerData = {
    id: expdata == null ? -1 : expdata.id,
    choice: [],
    text: [],
    code: '',
    score: 0,
    video: expdata==null?-1:expdata.videoId,
    phone: expdata == null ? -1 : expdata.phone,
    answeredNum: 0
};

var server = server_config;

$(document).ready(function () {
    // answerData=null;
    // window.localStorage.setItem("answer",JSON.stringify(answerData));
    console.log(expdata);
    if (expdata != null) {
        var user = $('#user').text(expdata.phone);
        console.log(user);
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
    answerData = JSON.parse(window.localStorage.getItem("answer"));
    if (answerData == null) {
        answerData = {
            id: expdata == null ? -1 : expdata.id,
            choice: [],
            text: [],
            code: [],
            score: 0,
            video: expdata==null?-1:expdata.videoId,
            phone: expdata == null ? -1 : expdata.phone,
            answeredNum: 0
        }
    }
    console.log(answerData);
    if (answerData != null && expdata.id == answerData.id) {
        loadAnswer();
    } else if (expdata.id != answerData.id) {
        answerData = {
            id: expdata == null ? -1 : expdata.id,
            choice: [],
            text: [],
            code: [],
            score: 0,
            video: expdata==null?-1:expdata.videoId,
            phone: expdata == null ? -1 : expdata.phone,
            answeredNum: 0
        }
    }
});

function loadAnswer() {
    console.log(answerData)
    if (answerData.choice != null) {
        for (var i = 0; i < answerData.choice.length; i++) {
            loadchoice(i);
        }
    }
    if (answerData.text != null) {
        for (var i = 0; i < answerData.text.length; i++) {
            loadText(i);
        }
    }
    loadCode();
}

function loadchoice(num) {
    if (answerData.choice[num] != " ") {
        var value = answerData.choice[num];
        var radioName = "answer" + (num + 1);
        var radio = document.getElementsByName(radioName);
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].value == value) {
                console.log("raido value: " + radio[i].value + " value: " + value + " " + radio[i].checked);
                radio[i].checked = "checked";
                return;
            }
        }
    }
}

function loadText(num) {
    if (answerData.text[num] != " ") {
        console.log("answerdata.text" + num + ": " + answerData.text[num]);
        var value = answerData.text[num];
        var textName = "text" + (num + 1);
        console.log(textName);
        var inputs = document.getElementById(textName);
        console.log(inputs.length);
        inputs.value = value;
    }
}

function loadCode() {
    if (answerData.code.length != 0) {
        var code = answerData.code;
        var codeInput = document.getElementById("code");
        codeInput.value = code;
    }
}

window.onbeforeunload = function (e) {
    console.log("离开测试了");
    if (answerData.answeredNum < 9) {
        var msg = "您还没有完成该测试，确定要离开本页面吗？做题进度将会被保留，可稍后继续作答";
        var e = window.event || e;
        if (e) {
            e.returnValue = msg;
        }
        checkAnswer();
        window.localStorage.setItem("answer", JSON.stringify(answerData));
        return msg;
    }
}

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

$('#submit').click(function (e) {
    console.log("提交点击")
    //选择题答案
    checkAnswer();
    if (answerData == null || answerData.answeredNum < 9) {
        window.localStorage.setItem("answer", JSON.stringify(answerData));
        alert("请答完所有题目在提交")
    } else {
        data = answerData;
        $.ajax({
            type: 'post',
            url: 'http://' + server.ip + ':' + server.port + '/users/test',
            data,
            success: function (res) {
                if (res.status == 0) {
                    alert("提交成功");
                    expdata.test=true;
                    window.localStorage.setItem("userInfo",JSON.stringify(expdata));
                    console.log(window.localStorage.getItem('action_record'));
                    video_data=window.localStorage.getItem('action_record');
                    data={videoLog: video_data};
                    console.log(video_data);
                    $.ajax({
                        type: 'post',
                        url: 'http://' + server.ip + ':' + server.port + '/upload',
                        data,
                        success: function (res) {
                            console.log(res.body);
                            if (res.status==0){
                                console.log(res.msg);
                            }
                        }
                        }
                    );
                    $(location).attr('href', 'postTest.html');
                    return;
                } else if (res.status == 1) {
                    alert("未查询到您的手机号，请检查是否有误，有问题请与实验人员联系");
                }
            }
        })
    }
});

function checkAnswer() {
    for (var i = 0; i < 5; i++) {
        checkChoice(i + 1);
    }
    //简答题答案
    for (var i = 0; i < 3; i++) {
        checkText(i + 1);
    }
    //操作题答案
    var code = $("#code").val();
    if (code.length > 0) {
        answerData.answeredNum++;
        answerData.code = code;
    }
    right_answer=['a','b','a','a','c']
    for (var i=0;i<answerData.choice.length;i++){
        if (right_answer[i]==answerData.choice[i]){
            answerData.score+=4;
        }
    }
}

/**
 * 单个选择题答案
 * @param answerNumber 选择题题号
 */
function checkChoice(answerNumber) {
    console.log(answerNumber);
    var radioName = "answer" + answerNumber;
    var radio = document.getElementsByName(radioName);
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            if (answerData.choice[answerNumber - 1] != null) {
                if (answerData.choice[answerNumber - 1] == " ") {
                    answerData.answeredNum++;
                }
                answerData.choice[answerNumber - 1] = radio[i].value;
            } else {
                answerData.answeredNum++;
                answerData.choice.push(radio[i].value);
            }
            return;
        }
    }
    if (answerData.choice[answerNumber - 1] == null) {
        answerData.choice.push(' ');
    }
}

/**
 * 简答题答案
 * @param answerNumber 要检查的简答题题号
 */
function checkText(answerNumber) {
    var inputId = "text" + answerNumber;
    var text = $("#" + inputId).val();
    if (text.length > 0) {
        if (answerData.text[answerNumber - 1] != null) {
            if (answerData.text[answerNumber - 1] == " ") {
                answerData.answeredNum++;
            }
            answerData.text[answerNumber - 1] = text;
        } else {
            answerData.text.push(text);
            answerData.answeredNum++;
        }
        return
    }
    if (answerData.text[answerNumber - 1] == null) {
        answerData.text.push(' ');
    }
}