var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
var server=server_config;
answerData={
    id: expdata == null ? -1 : expdata.id,
    phone: expdata == null ? -1 : expdata.phone,
    choice:[],
    video: expdata==null?-1:expdata.videoId,
    answeredNum:0,
}
$(document).ready(function () {
    if (expdata != null) {
        $('#user').text(expdata.phone);
        if (expdata.preTest) {
            alert("您已经完成了课前调查部分，请完成后续步骤");
            $(location).attr("href", "video.html");
        }
    } else if (expdata == null || expdata.phone.length == 0) {
        alert("登录后才能完成后续步骤哦");
        $(location).attr("href", "signup.html");
    } else if (expdata.preTest == false) {
        alert("请先完成课前调查");
        $(location).attr("href", "preTest.html");
    } else if (expdata.test) {
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

$('#submit').click(function (e) {
    for (var i=0;i<5;i++) {
        checkChoice(i+1)
    }
    if (answerData == null || answerData.answeredNum < 5) {
        alert("请答完所有题目在提交")
    } else {
        data = answerData;
        $.ajax({
            type: 'post',
            url: 'http://' + server.ip + ':' + server.port + '/users/preTest',
            data,
            success: function (res) {
                console.log(res.body);
                if (res.status == 0) {
                    expdata.preTest=true;
                    window.localStorage.setItem("userInfo", JSON.stringify(expdata));
                    alert("已提交，即将前往下一步");
                    $(location).attr('href', 'video.html');
                    return;
                }
            }
        })
    }
});

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