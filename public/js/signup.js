/**
 * 用于存储用户登录信息
 * @type {{test: boolean, phone: string, id: string, preTest: boolean, postTest: boolean}}
 *
 * @param phone: 用户的手机，显示在登录位置
 * @param preTest: 课前调查是否已完成
 * @param postTest: 课后调查是否已完成
 * @param test: 课堂测试是否已完成
 */
expdata = {
    phone: '',
    id: '',
    preTest: false,
    test: false,
    postTest: false,
    videoId: -1
};

/**
 * 处理用户登录信息
 */
$(document).ready(function () {
    var ex = JSON.parse(window.localStorage.getItem("userInfo"));
    if (ex != null) {
        var user = $('#user').text(ex.phone);
        console.log(user);
    }
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

    var userphone = $('#phone').val();
    data = {phone: userphone};
    $.ajax({
        type: 'post',
        url: 'http://localhost:65535/users/login',
        data,
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                $(location).attr('href', 'preTest.html');
                expdata.id = res.id;
                expdata.phone = userphone;
                expdata.videoId=res.videoId;
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