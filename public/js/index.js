var expdata = JSON.parse(window.localStorage.getItem("userInfo"));

$(document).ready(function () {
    // expdata=null;
    if (expdata != null) {
        $('#user').text(expdata.phone);
    }
});

function signinClick(exdata) {
    if (exdata != null) {
        console.log(exdata);
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
    console.log("我进来了")
    expdata = signinClick(expdata);
    window.localStorage.setItem("userInfo", JSON.stringify(expdata));
});