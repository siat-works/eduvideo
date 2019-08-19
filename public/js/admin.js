var server = server_config;
var expdata = JSON.parse(window.localStorage.getItem("userInfo"));

$(document).ready(function () {
    loadTable();
});

function loadTable() {
    $('#table_content').empty();
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/admin/table',
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                fillTable(res);
            } else if (res.status == 5) {
                alert("此手机号已添加，请检查后重新输入");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

$('#load').click(function () {
    loadTable();
});

function fillTable(res) {
    var params = res.result;
    for (var i = 0; i < params.length; i++) {
        var userId = params[i].id;
        var str = '<tr id="' + userId + '"><td>' + userId + '</td><td>'+params[i].name+'</td><td>' + params[i].phone + '</td><td>' + params[i].gender + '</td><td>'+params[i].notes+'</td>';
        var btn = '<td><a rel="nofollow" class="btn nofollow" type="button" style="margin:0 auto;color:wheat;background-color:red; display: block" id="del' + userId + '">删除</a></td>'
        var tail = '</tr>';
        str += btn + tail;
        $('#table_content').append(str);
        // $('#del'+userId).click(function () {
        //     console.log("按键 "+userId+" clicked");
        //     data = {id: userId};
        //     console.log(data);
        //     $.ajax({
        //         type: 'post',
        //         url: 'http://' + server.ip + ':' + server.port + '/users/admin/delete',
        //         data,
        //         success: function (res) {
        //             console.log(res);
        //             if (res.status == 0) {
        //                 $('#'+userId).remove();
        //                 loadTable();
        //                 // window.location.reload();
        //                 $('#phone').val('');
        //                 return;
        //             }
        //         },
        //         error: function (err) {
        //             console.log(err);
        //         }
        //     });
        // });
    }
    $('#phone').val('');
    return;
}

$(document).click(function (e) {
    var id = $(e.target).attr('id');
    if (id.startsWith('del')) {
        console.log(id);
        var userId = id.replace('del', '');
        data = {id: userId};
        console.log(data);
        $.ajax({
            type: 'post',
            url: 'http://' + server.ip + ':' + server.port + '/users/admin/delete',
            data,
            success: function (res) {
                console.log(res);
                if (res.status == 0) {
                    $('#' + userId).remove();
                    loadTable();
                    // window.location.reload();
                    $('#phone').val('');
                    return;
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
});

$('#search').click(function () {
    var phone = $('#phone').val();
    data = {phone: phone};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/admin/search',
        data,
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                $('#table_content').empty();
                fillTable(res);
                // window.location.reload();
                $('#phone').val('');
                return;
            } else if (res.status == 5) {
                alert("无此记录，请查证后重新输入");
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
});

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
        return;
    }
    data = {phone: userphone};
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/admin',
        data,
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                loadTable();
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


$('#uploadFile').click(function () {
    var file = $('#file')[0].files[0];
    if (file == null){
        alert('请选择文件在上传');
        return;
    }
    console.log(file);
    var data=new FormData();
    data.append('files',file);
    alert("正在上传文件和处理中，请稍侯片刻。。。处理完的结果将会展示在下方表格中");
    data.append("service",'App.Passion.UploadFile');
    $.ajax({
        type: 'post',
        url: 'http://' + server.ip + ':' + server.port + '/users/admin/uploadFile',
        processData: false,
        contentType: false,
        data,
        success: function (res) {
            if (res.status==0){
                loadTable();
                return;
            }else if (res.status==5){
                alert(res.phone+'已存在，请查证文件');
            }
        }
    });
});