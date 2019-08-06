var expdata = JSON.parse(window.localStorage.getItem("userInfo"));
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
    var name = $('#name').val();
    var gender = '';
    var radio = document.getElementsByName('gender');
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            gender = radio[i].value;
            data = {id: expdata.id, name: name, gender: gender,phone: expdata.phone};
            flag=false;
            $.ajax({
                type: 'post',
                url: 'http://localhost:65535/users/preTest',
                data,
                success: function (res) {
                    if (res.status == 0) {
                        console.log("ajax success");
                        flag=true;
                        alert("提交成功");
                        $(location).attr('href', 'video.html');
                        expdata.preTest = true;
                        window.localStorage.setItem("userInfo", JSON.stringify(expdata));
                    } else if (res.status == 1) {
                        alert("未查询到您的手机号，请检查是否有误，有问题请与实验人员联系");
                    }
                },
                error: function (res) {
                    console.log("错误"+res);
                }
            });
            // if (!flag){
            //     alert("提交成功");
            //     $(location).attr('href', 'video.html');
            // }
            return;
        }
    }
});