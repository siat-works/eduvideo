var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
var server = server_config;
answerData = {
    id: expdata == null ? -1 : expdata.id,
    phone: expdata == null ? -1 : expdata.phone,
    choice: [],
    gender: '',
    age: '',
    major: '',
    level: '',
    video: expdata == null ? -1 : expdata.videoId,
    answeredNum: 0
};

$(document).ready(function () {
    // answerData=null;
    window.localStorage.setItem("answer", JSON.stringify(null));
    if (expdata != null) {
        var user = $('#user').text(expdata.phone);
        console.log(user);
    }
    if (expdata == null || expdata.phone.length == 0) {
        alert("登录后才能完成后续步骤哦");
        $(location).attr("href", "index.html");
    } else if (expdata.preTest == false) {
        alert("请先完成课前调查");
        $(location).attr("href", "preTest.html");
    } else if (expdata.videoFinished == false) {
        alert("请观看完整个视频才能进行答题")
        $(location).attr("href", "video.html");
    } else if (!expdata.test) {
        alert("请您先看完视频并做完课堂测试在进行课后调查");
        $(location).attr("href", "video.html");
    }
});


window.onbeforeunload = function (e) {
    if (expdata.test) {
        console.log("离开测试了");
        if (answerData.answeredNum < 13) {
            var msg = "您还没有完成该测试，确定要离开本页面吗？做题进度将会被保留，可稍后继续作答";
            var e = window.event || e;
            if (e) {
                e.returnValue = msg;
            }
            checkAnswer();
            return msg;
        }
    }
}

function signinClick(exdata) {
    if (exdata != null) {
        var msg = "您已登录，确定要注销该账户吗？";
        if (confirm(msg) == true) {
            exdata = null;
            localStorage.setItem('userInfo',null);
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

$('#submit').click(function (e) {
    console.log("提交点击")
    //选择题答案
    checkAnswer();
    if (answerData == null || answerData.answeredNum < 13) {
        alert("请您答完所有题目才能提交")
    } else {
        data = answerData;
        $.ajax({
            type: 'post',
            url: 'http://' + server.ip + ':' + server.port + '/users/postTest',
            data,
            success: function (res) {
                console.log(res.body);
                if (res.status == 0) {
                    alert("您已完成此次实验，感谢您的参与，再见(￣▽￣)／");
                    window.localStorage.setItem("userInfo", null);
                    $(location).attr('href', 'index.html');
                    return;
                } else if (res.status == 1) {
                    alert("未查询到您的手机号，请检查是否有误，有问题请与实验人员联系");
                }
            }
        })
    }
});

function checkAnswer() {
    answerData = {
        id: expdata == null ? -1 : expdata.id,
        phone: expdata == null ? -1 : expdata.phone,
        choice: [],
        gender: '',
        age: '',
        major: '',
        level: '',
        video: expdata == null ? -1 : expdata.videoId,
        answeredNum: 0
    };
    for (var i = 0; i < 9; i++) {
        checkChoice(i + 1);
    }
    var gender = document.getElementsByName('gender');
    for (var i = 0; i < gender.length; i++) {
        if (gender[i].checked) {
            answerData.answeredNum++;
            answerData.gender = gender[i].value;
        }
    }
    var age = $("#age").val();
    if (age.length > 0) {
        answerData.answeredNum++;
        answerData.age = age;
    }
    var major = $("#major").val();
    if (major.length > 0) {
        answerData.answeredNum++;
        answerData.major = major;
    }

    var level = document.getElementsByName('level');
    for (var i = 0; i < level.length; i++) {
        if (level[i].checked) {
            answerData.answeredNum++;
            answerData.level = level[i].value;
        }
    }
    console.log(answerData);
}

var age = document.getElementById('age');
age.onchange = function () {
    var age = $("#age").val();
    if (/^[0-9]+$/.test(age)) {
        var num = parseInt(age);
        if (num > 10 && num < 100) {
            answerData.answeredNum++;
            answerData.age = age;
            flag = true;
        } else {
            console.log(age)
            $('#age').val('');
            alert("请输入您的真实年龄，谢谢配合")
        }
    } else {
        $('#age').val('');
        alert("年龄中含有非法字符，请确认后重新输入");
    }
};

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

