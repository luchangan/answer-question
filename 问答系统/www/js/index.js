$(function () {
    // 控制下拉菜单位置
    $('body').on('click', '.userName', function () {
        $('.user-info').css({
            top: 50 + 'px',
            right: -10 + 'px'
        })
        $('.user-info').slideToggle(200);
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
