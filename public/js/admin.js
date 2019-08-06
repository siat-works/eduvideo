var server = server_config;

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
    if (userphone.length != 11) {
        alert("手机号有误，请重新输入");
        $('#phone').val('');
    }
    data = {phone: userphone};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/admin',
        data,
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                $('#phone').val('');
                return;
            } else if (res.status == 5) {
                alert("此手机号已添加，请检查后重新输入");
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
});