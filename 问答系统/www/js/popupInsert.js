// 自定义插件 首页引入才能使用
$.extend({
    popup: function (value) {
        // this.each(function() {

        // });
        $(".popup").fadeOut('fast', function () {
            this.remove();
        });
        $(".mask").fadeOut('fast', function () {
            this.remove();
        });
        // 声明变量插入内容
        var html = "<div class=\"popup popup01\">" + "  <div class=\"pop-close\">x</div>" + "  <div class=\"pop-title\">提示信息</div>" + "  <div class=\"pop-content\">注册成功</div>" + "<button class='btn1'>确定</button>" + "<button class='btn2'>取消</button>" + "</div>" + "<div class=\"mask\"></div>";
        $("body").append(html);
        $(".pop-content").html(value);
        $(".popup").hide();
        $(".popup").fadeIn();
        $(".mask:eq(0)").fadeIn();
        $("body").on("click", ".pop-close", function () {
            $(this).parents(".popup").fadeOut('fast', function () {
                this.remove();
            });
            $(".mask").fadeOut('fast', function () {
                this.remove();
            });
        })
        $('.btn1').click(function () {
            location.href='index.html';
        })
        $('.btn2').click(function () {
            $(".popup").fadeOut('fast', function () {
                this.remove();
            });
            $(".mask").fadeOut('fast', function () {
                this.remove();
            });
        })

    }
})