$(function () {
    var $_this1 = '.geQuLieBiaoFirst '; //歌曲列表的暂停按钮的this
    var $audio = $('audio');
    var player = new Player($audio);
    var gangJinLai = true;
    var gangJinLai1 = true;
    var progress;
    var sheng;
    var lrc;
    var togglezi; //切换歌词时判断是否切换了歌曲

    //播放进度条
    var progressBar = $('.footer-in-jinDu-xia>div');
    var progressline = $('.footer-in-jinDu-xia>div div:first-child');
    var progressdot = $('.footer-in-jinDu-xia>div div:last-child');
    progress = new Progress(progressBar, progressline, progressdot);
    progress.proclick(function (value) {
        player.diJijindutiao(value);
    });
    progress.promove(function (value) {
        player.diJijindutiao(value);
    });

    //声音进度条
    var shengBar = $('.footer-in-shengYin>div:nth-child(2)');
    var shengline = $('.footer-in-shengYin>div:nth-child(2) div:nth-child(1)');
    var shengdot = $('.footer-in-shengYin>div:nth-child(2) div:last-child');
    sheng = Progress(shengBar, shengline, shengdot);
    sheng.proclick(function (value) {
        player.musicShengYin(value);
    });
    sheng.shengmove(function (value) {
        player.musicShengYin(value, function (value) {
            if (value == 0) {
                shengline.css("width", 0);
                shengdot.css("marginLeft", 0);
                $('.footer-in-shengYin>div:first-child').addClass('footer-in-shengYin17');
            } else if (value == 1) {
                shengline.css("width", 80);
                shengdot.css("marginLeft", 70);
                $('.footer-in-shengYin>div:first-child').removeClass('footer-in-shengYin17');
            }
        });
    });

    //监听声音设置切换静音
    $('.footer-in-shengYin>div:first-child').click(function () {
        $('.footer-in-shengYin>div:first-child').toggleClass('footer-in-shengYin17');
        if ($('.footer-in-shengYin>div:first-child')[0].classList.contains('footer-in-shengYin17')) {
            shengline.css("width", 0);
            shengdot.css("marginLeft", 0);
            player.musicShengYin(0);
        } else {
            shengline.css("width", 80);
            shengdot.css("marginLeft", 70);
            player.musicShengYin(1);
        }
    });

    //加载歌曲列表
    getGeQu();
    //隐藏浏览器滚动条
    document.documentElement.style.overflow = 'hidden';
    //自定义歌曲滚动条
    $('.content-in-left-bottom').mCustomScrollbar();

    //委托监听鼠标移入歌曲子列表
    $('.content-in-left-bottom-ul').delegate(".geQuLieBiao", "mouseenter", function () {
        $(this).css("opacity", 1);
        $(this).find("ul").css("display", "block");
        $(this).find("p:nth-of-type(2)").css("display", "none");
        $('.geQuLieBiao li').hover(function () {
            $(this).css("opacity", 1);
        }, function () {
            $(this).css("opacity", 0.5);
        })
    });

    //委托监听鼠标移出歌曲子列表
    $('.content-in-left-bottom-ul').delegate(".geQuLieBiao", "mouseleave", function () {
        $(this).css("opacity", 0.5);
        $(this).find("ul").css("display", "none");
        $(this).find("p:nth-of-type(2)").css("display", "block");
    });

    //委托监听鼠标点击复选框
    $('.content-in-left-bottom-ul').delegate(".geQuLieBiao div:first-child", "click", function () {
        $(this).toggleClass('duiHao');
    });

    //监听鼠标点击全选复选框
    $('.tttt').click(function () {
        $(this).toggleClass('duiHao');
        if ($('.tttt')[0].classList.contains('duiHao')) {
            $('.geQuLieBiao').find('div:first-child').addClass('duiHao');
        } else {
            $('.geQuLieBiao').find('div:first-child').removeClass('duiHao');
        }
    });

    //监听鼠标点击暂停开始按钮
    $('.footer-in-left li:nth-child(2)').click(function () {
        //歌曲列表播放按钮同步
        $('.footer-in-left li:nth-child(2)').toggleClass('glyphicon-pause');
        var zhaoFu = $($_this1).parents('.geQuLieBiao');
        //是否是用户刚进来点击的第一首
        if (gangJinLai) {
            //判断用户是否之前点过歌曲
            if (zhaoFu.get(0).index == zhaoFu.length - 1) {
                player.playMusic(0, $('.geQuLieBiao')[0].ele);
                //判断是否要切换第一个播放按钮
                if ($($_this1)[0].classList.contains('geQuLieBiaou18')) {
                    $('.geQuLieBiao ul li:first-child')[0].classList.remove("geQuLieBiaou18");
                } else {
                    $('.geQuLieBiao ul li:first-child')[0].classList.add("geQuLieBiaou18");
                }
            } else {
                $($_this1).toggleClass("geQuLieBiaou18");
                player.playMusic(zhaoFu.get(0).index, zhaoFu.get(0).ele);
            }
            //点过第一次开始按钮
            gangJinLai = false;
        } else {
            //是否是第一首歌曲
            if (zhaoFu.get(0).index == zhaoFu.length - 1) {
                //判断用户是否在点过第一首自定义歌曲后是否点过其他歌曲
                if (gangJinLai1) {
                    //判断是否要切换第一个播放按钮
                    if ($($_this1)[0].classList.contains('geQuLieBiaou18')) {
                        $('.geQuLieBiao ul li:first-child')[0].classList.remove("geQuLieBiaou18");
                    } else {
                        $('.geQuLieBiao ul li:first-child')[0].classList.add("geQuLieBiaou18");
                    }
                    player.playMusic(0, $('.geQuLieBiao')[0].ele);
                } else {
                    player.playMusic(zhaoFu.get(0).index, zhaoFu.get(0).ele);
                }
            } else {
                //切换歌曲列表播放按钮
                $($_this1).toggleClass("geQuLieBiaou18");
                //已点过其他歌曲
                gangJinLai1 = false;
                //切换歌曲播放状态
                player.playMusic(zhaoFu.get(0).index, zhaoFu.get(0).ele)
            }
        }
        //歌曲列表序号切换播放状态
        if ($('.geQuLieBiao ul li:first-child').eq(0).hasClass('geQuLieBiaou18')) {
            $('.geQuLieBiao span')[0].style.opacity = "0";
            $('.geQuLieBiao div:last-child')[0].style.display = "block";
        } else if ($($_this1).eq(0).hasClass('geQuLieBiaou18')) {
            zhaoFu.find('span').css("opacity", "0");
            zhaoFu.find('div:last-child').css("display", "block");
        } else {
            zhaoFu.find('span').css("opacity", "1");
            zhaoFu.find('div:last-child').css("display", "none");
        }
    });

    //委托监听鼠标点击歌曲列表的暂停开始按钮
    $('.content-in-left-bottom-ul').delegate(".geQuLieBiao ul li:first-child", "click", function () {
        $_this1 = this;
        var zhaofu = $(this).parents('.geQuLieBiao');
        //判断是否没有切换歌曲
        if (zhaofu.get(0).index == player.currentIndex) {
        } else {
            initMusicLyr(zhaofu.get(0).ele);
        }
        //删除其他的播放中的图示
        zhaofu.siblings().find('ul li:first-child').removeClass('geQuLieBiaou18');
        zhaofu.siblings().find('ul li:last-child').removeClass('boFangZhong');
        //切换当前播放按钮的图示
        $(this).toggleClass("geQuLieBiaou18");
        //判断歌曲列表的播放图示是否存在，然后进行下面播放按钮切换
        var panduan = $(this).eq(0).hasClass('geQuLieBiaou18');
        if (!panduan) {
            $('.footer-in-left li:nth-child(2)').toggleClass('glyphicon-pause');
        } else {
            $('.footer-in-left li:nth-child(2)').addClass('glyphicon-pause');
        }
        //切换歌曲列表左边播放图示
        zhaofu.find('ul li:last-child').toggleClass("boFangZhong");
        if ($(this).eq(0).hasClass('geQuLieBiaou18')) {
            zhaofu.find('span').css("opacity", "0");
            zhaofu.find('div:last-child').css("display", "block");
        } else {
            zhaofu.find('span').css("opacity", "1");
            zhaofu.find('div:last-child').css("display", "none");
        }
        zhaofu.siblings().find('span').css("opacity", "1");
        zhaofu.siblings().find('div:last-child').css("display", "none");
        //播放音乐
        player.playMusic(zhaofu.get(0).index, zhaofu.get(0).ele);
        initMusicInfo(zhaofu.get(0).ele);

    });

    //委托监听鼠标点击歌曲列表的删除按钮
    $('.content-in-left-bottom-ul').delegate(".geQuLieBiao ul li:nth-child(5)", "click", function () {
        //正在播放时播放下一首
        if ($(this).parents('.geQuLieBiao').get(0).index == player.currentIndex) {
            if (player.audio.paused) {
                var dd = confirm("是否确定删除歌曲");
                if (dd) {
                    //刚刚播放过歌曲并且暂停时弹出
                } else {
                    return;
                }
            } else {
                $('.footer-in-left li:nth-child(3)').trigger('click');
            }
        }
        //删除用户列表的歌曲
        $(this).parents('.geQuLieBiao').remove();
        //删除缓存的歌曲json
        player.changeMusic($(this).parents('.geQuLieBiao').get(0).index);
        //调整序号的index
        $('.geQuLieBiao').each(function (index, ele) {
            ele.index = index;
            $(ele).find('span').text(index + 1);
        })
    });

    //监听鼠标点击左换曲
    $('.footer-in-left li:nth-child(1)').click(function () {
        $('.geQuLieBiao').eq(player.preIndex()).find('.geQuLieBiaoFirst').trigger('click');
    });

    //监听鼠标点击右换曲
    $('.footer-in-left li:nth-child(3)').click(function () {
        $('.geQuLieBiao').eq(player.nextIndex()).find('.geQuLieBiaoFirst').trigger('click');
    });

    //进度条播放时间同步
    player.musicTimeUpDate(function (duration, currentTime, geShiHua) {
        if (currentTime>parseInt(duration)) {
            initMusicLyr(player.musicList[player.currentIndex]);
        }
        $('.footer-in-jinDu-shang div:last-child').text(geShiHua);
        if (progress.tuozuaishi) {
            return;
        }
        var biLi = currentTime / duration;
        var biLis = parseFloat(biLi.toFixed(3));
        if (String(biLis) == "NaN") {
            biLis = 0;
        }
        var ff = biLis * 100;
        progressline.css({
            "width": ff + "%"
        });
        progressdot.css({
            "marginLeft": ff + "%"
        });
        lrc.getcurrentTime(currentTime); //同步歌词
    });

    //加载歌曲列表
    function getGeQu() {
        $.ajax({
            url: "./123.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                $.each(data, function (index, ele) {
                    var $item = crateMusic(index, ele);
                    var $musicList = $('.content-in-left-bottom-ul');
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyr(data[0]);
            },
            error: function (e) {
                e = "ajax获取失败";
                console.log(e);
            }
        })
    }

    //初始化歌曲信息
    function initMusicInfo(music) {
        $('.content-in-right-top').eq(0).css("background", "url(" + music.cover + ")").css("background-size", "100% 100%");
        $('.content-in-right-con p:first-child span').text(music.name);
        $('.content-in-right-con p:last-child span').text(music.singer);
        $('.footer-in-jinDu-shang div:first-child').text(music.name + " / " + music.singer);
        $('.footer-in-jinDu-shang div:last-child').text("00:00 / " + music.time);
        $('.moHu').css("background", "url(" + music.cover + ")").css("background-size", "100% 100%");
    }

    //初始化歌词信息
    function initMusicLyr(music) {
        lrc = new Lyric(music.link_lrc);
        $('.content-in-right-foot').html('');
        lrc.loadric(function () {
            $.each(lrc.gecishuzu, function (index, value) {
                var gege = $("<div>" + value + "</div>");
                $('.content-in-right-foot').append(gege);
            });
        });
    }

    //创建一条音乐
    function crateMusic(index, ele) {
        var $item = $("<li class=\"geQuLieBiao\">\n" +
            "                        <div></div>\n" +
            "                        <span>" + (index + 1) + "</span>\n" +
            "                        <div>" + ele.name + "</div>\n" +
            "                        <p>" + ele.singer + "</p>\n" +
            "                        <p>" + ele.time + "</p>\n" +
            "                        <ul>\n" +
            "                            <li class=\"geQuLieBiaoFirst\"></li>\n" +
            "                            <li></li>\n" +
            "                            <li></li>\n" +
            "                            <li></li>\n" +
            "                            <li></li>\n" +
            "                            <li></li>\n" +
            "                        </ul>\n" +
            "                        <div></div>\n" +
            "                    </li>");
        $item.get(0).index = index;
        $item.get(0).ele = ele;
        return $item;
    }

    //背景及兼容判断
    function panDuanBrowser(){
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("Opera") > -1) {
            return "Opera"
        }
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        }
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        }
        if (userAgent.indexOf("NET") || userAgent.indexOf("MSIE")) {
            return "IE";
        }
    }
    if ("IE"==panDuanBrowser()) {
        $(".moHu").eq(0).css('background','url("imgs/timg.jpg") no-repeat !important').css('background-size','cover !important');
        $(".mengBan")[0].style.opacity = "0.7";
    }
    if ("Safari"==panDuanBrowser()) {
        $(".moHu").eq(0).css('background','url("imgs/timg.jpg") no-repeat !important').css('background-size','cover !important');
        $(".mengBan")[0].style.opacity = "0.7";
        alert("暂不支持Safari浏览器播放");
    }

});
