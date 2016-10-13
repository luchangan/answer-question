$(function () {
    // 控制下拉菜单位置
    $('body').on('click', '.userName', function () {
        if ($.cookie('user') == 'null') {
            location.href='login.html';
        } else {
            $('.user-info').css({
                top: 50 + 'px',
                right: -10 + 'px'
            })
            $('.user-info').slideToggle(200);
        }
    })
});
// 当尺寸发生改变的时候
//window.onresize = function () {
//    var top = $('.userName').offset().top + 35;
//    var left = $('.userName').offset().left - 80;
//    $('.user-info').css({
//        top: top + 'px',
//        left: left + 'px'
//    })
//}
function formatTime(val) {
    var time = new Date(val);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    minute = minute < 10 ? "0" + minute : minute;
    return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute);
}
function formatContent(str){
    val.replace(/</g,'&lt;')
    val.replace(/>/g,'&gt;')
    return str;
}