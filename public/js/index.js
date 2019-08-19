/**
 * 用于存储用户登录信息
 * @type {{test: boolean, phone: string, id: string, preTest: boolean, postTest: boolean}}
 *
 * @param phone: 用户的手机，显示在登录位置
 * @param preTest: 课前调查是否已完成
 * @param postTest: 课后调查是否已完成
 * @param test: 课堂测试是否已完成
 */
// window.localStorage.setItem("userInfo",null);
expdata = {
    phone: '',
    id: '',
    preTest: false,
    test: false,
    postTest: false,
    videoFinished:false,
    videoId: -1
};
expdata = JSON.parse(window.localStorage.getItem("userInfo"));

var server = server_config;

$(document).ready(function () {
    // answerData=null;
    console.log(expdata);
    if (expdata != null) {
        var user = $('#user').text(expdata.phone);
        console.log(user);
    }else {
        expdata = {
            phone: '',
            id: '',
            preTest: false,
            test: false,
            postTest: false,
            videoFinished:false,
            videoId: -1
        };
    }
});

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


/**
 * 登录
 */
$('#submit').click(function (e) {
    // console.log($('#phone').val());
    // var userphone=$('#phone').val();
    // for (var i=0;i<3;i++){
    //     if (phoneNumber[i]==userphone){
    //         console.log(userphone+" "+phoneNumber[i]);
    //         $(location).attr('href', 'video.html');
    //         console.log(window.location.href);
    //         return;
    //     }
    // }
    // alert("手机号输入有误，请检查后重新输入")
    expdata = {
        phone: '',
        id: '',
        preTest: false,
        test: false,
        postTest: false,
        first_to_video: 0,
        videoFinished:false,
        videoId: -1
    };
    var userphone = $('#phone').val();
    var data;
    data = {phone: userphone};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/login',
        data,
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                $(location).attr('href', 'preTest.html');
                expdata.id = res.id;
                expdata.phone = userphone;
                expdata.videoId = res.videoId;
                console.log(expdata);
                window.localStorage.setItem("userInfo", JSON.stringify(expdata));
                $('#user').text(userphone);
                return;
            } else if (res.status == 1) {
                alert("未查询到您的手机号，请检查是否有误，有问题请与实验人员联系");
            }
        }
    })
});