//歌词
(function (window) {
    var bug1;  //歌词行(包括所有带时间的)
    var shangYiGe; //回放歌词
    var index2 = 0;   //包含空歌词的index

    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }

    //进度条原型
    Lyric.prototype = {
        constructor: Lyric,
        times: [], //包含空歌词的时间数组
        times2:[], //快进歌词时参照时间数组(包含有歌词的时间数组)
        times3:[], //倒退歌词时参照时间数组(包含空歌词的时间数组)
        gecishuzu: [],
        index : 0,    //包含有歌词的index
        init: function (path) {
            this.path = path;
        },

        //调取歌词TXT
        loadric: function (fun) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    $this.data = data;
                    $this.parseLrc(data);
                    fun();
                },
                error: function (e) {
                    e = "ajax获取失败";
                    console.log(e);
                }
            })
        },

        //获取歌词
        parseLrc: function (data) {
            var $this = this;
            index2 = 0;
            $this.times = [];
            $this.times2 = [];
            $this.times3 = [];
            $this.gecishuzu = [];
            $this.index = 0;
            $this.geCiHang = data.split("\n");
            bug1 = $this.geCiHang;
            var zhengZe = /\[(\d+:\d+.\d+)\]/;
            $.each(this.geCiHang, function (index, ele) {
                var shijian = zhengZe.exec(ele);
                if (shijian == null) {
                    return true;
                }
                var shijianzu = shijian[1].split(":");
                var shijianzu1 = parseInt(shijianzu[0]) * 60;
                var shijianzu2 = parseFloat(shijianzu[1]);
                var shijianshuzu = parseFloat((shijianzu1 + shijianzu2).toFixed(2));
                $this.times.push(shijianshuzu);
                $this.times3.push(shijianshuzu);
                var geCiHang22 = $this.geCiHang[index].split("]");
                if (geCiHang22[1].length == 1) {  //长度为1是空格,返回
                    return true;
                } else {
                    $this.gecishuzu.push(geCiHang22[1]);
                    $this.times2.push(shijianshuzu);
                }
            });
        },

        //歌词同步
        getcurrentTime: function (currentTime) {
            var index1;
            var kuaiBo;
            var kuaiBo2;
            var times3 = [];
            var _this = this;
            //未知bug(创建第三个原型时,index是数字时,这个不能用??)
            if (index2==undefined){
                this.index = 0;
                index2 = 0;
            }
            var geCiHangCurrentTime = bug1[index2].split("]");
            if (currentTime > this.times[0] && geCiHangCurrentTime[1].length !== 1) {
                //快进播放时
                if(currentTime > this.times[1]){
                    $.each(this.times,function (index, value) {
                        if (currentTime>value) {   //快进到当前正在唱的时间段(还没唱完)
                            index1 = index;
                        }
                    });
                    this.times.splice(0,index1-1);  //删除已经播放过的时间(正在唱的时间没删)
                    index2+=(index1-1); //跳到包含空歌词的歌词行index
                    $.each(this.times2,function (index, value) {
                        if (value == _this.times[0]) {
                            kuaiBo = index;
                        }
                    });
                    // console.log(kuaiBo);
                    // console.log(currentTime);
                    // console.log(this.times[1]);
                    // console.log(this.times2[kuaiBo]);
                    this.index = kuaiBo+1;
                }else {
                    this.index++; //index-1为当前歌曲播放的行数
                }
                if (index2<this.gecishuzu.length-1) {   //判断是否超出了歌词时间数组的总长度
                    index2++;
                }
                shangYiGe = this.times.shift();
                $('.content-in-right-foot div').eq(this.index - 1).siblings().removeClass('contentinrightfoot');
                $('.content-in-right-foot div').eq(this.index - 1).addClass('contentinrightfoot');
                if (this.index>=6){  //到第五行歌词时滚动
                    $(".content-in-right-foot").animate({
                        marginTop: (-this.index+4)*26
                    }, 600)
                }else if(this.index<6 || this.index){
                    $('.content-in-right-foot').css('marginTop',0);
                }

            } else if (currentTime > this.times[0]) {
                shangYiGe = this.times.shift();
                if (index2<this.gecishuzu.length-1) {
                    index2++;
                }
            }else if(currentTime < shangYiGe){   //倒退歌词
                //获取当前倒退后,不包含空歌词的行数
                $.each(this.times2,function (index, value) {
                    if (value <= currentTime) {
                        kuaiBo = index;
                    }
                });
                this.index = kuaiBo;
                //获取当前倒退后,包含空歌词的行数
                $.each(this.times3,function (index, value) {
                    if (value == _this.times2[kuaiBo]) {
                        kuaiBo2 = index;
                    }
                })
                index2 = kuaiBo2;
                //复制倒退歌词时参照时间数组
                $.each(this.times3,function (index, value) {
                    times3[index] = _this.times3[index];
                })
                times3.splice(0,kuaiBo2-1);
                this.times = times3;
            }
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);









