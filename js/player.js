//音乐播放play
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }

    Player.prototype = {
        constructor: Player,
        //歌曲的json数据
        musicList: [],
        //开始audio标签
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0)
        },
        //当前播放歌曲index
        currentIndex: -1,
        //播放状态切换
        playMusic: function (index, ele) {
            if (this.currentIndex == index) {
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                this.$audio.attr("src", ele.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        //上一首
        preIndex: function () {
            var ff = this.currentIndex - 1;
            if (ff < 0) {
                ff = this.musicList.length - 1;
            }
            return ff;
        },
        //下一首
        nextIndex: function () {
            var ff = this.currentIndex + 1;
            if (ff > this.musicList.length - 1) {
                ff = 0;
            }
            return ff;
        },
        //删除歌曲
        changeMusic: function (index) {
            this.musicList.splice(index,1);
            if (index<this.currentIndex){
                this.currentIndex--;
            }
        },
        //监听歌曲播放进度(获取歌曲总时长:this.audio.duration;已播放时长:this.audio.currentTime)
        musicTimeUpDate:function (Func) {
            var $_this = this;
            this.$audio.on("timeupdate ",function (event) {
                var geShiHua = $_this.geShiHuaShiJian($_this.audio.currentTime);
                Func($_this.audio.duration,$_this.audio.currentTime,geShiHua);
            });
        },
        //定义一个格式化时间的方法
        geShiHuaShiJian:function (b) {
            //歌曲当前已播放时长
            var min = parseInt(b/60);
            var sec = parseInt(b%60);
            if (min<10){
                min = "0" + min;
            }
            if (sec<10){
                sec = "0" + sec;
            }
            if (this.currentIndex==-1){
                var obMusic = $('.geQuLieBiao').get(0).ele;
            } else {
                var obMusic = $('.geQuLieBiao').get(this.currentIndex).ele;
            }
            return min+":"+sec+" / "+obMusic.time;
        },
        //监听点击播放进度条
        diJijindutiao:function (value) {
            this.audio.currentTime = this.audio.duration * value;
        },
        musicShengYin:function (value,fun) {
            if (value<0){
                value = 0;
                fun(value);
            }else if(value>1){
                value = 1;
                fun(value);
            }else if(value>0 && value<1){
                $('.footer-in-shengYin>div:first-child').removeClass('footer-in-shengYin17');
            }
            this.audio.volume =value;
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);