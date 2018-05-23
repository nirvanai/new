//进度条
(function (window) {
    function Progress(progressBar,progressline,progressdot) {
        return new Progress.prototype.init(progressBar,progressline,progressdot);
    }

    //进度条原型
    Progress.prototype = {
        constructor: Progress,
        tuozuaishi : false, //判断鼠标是否正在点击移动进度条,停止播放中的进度条
        panDuanTaiQi : false, //判断鼠标是否正在点击移动进度条
        init: function (progressBar,progressline,progressdot) {
            this.progressBar = progressBar;
            this.progressline = progressline;
            this.progressdot = progressdot;

        },

        //设置监听鼠标点击播放进度条和声音进度条
        proclick:function (Functions) {
            var _this = this;
            this.progressBar.click(function (e) {
                var offleft = _this.progressBar.offset().left;
                var dd = e.pageX - offleft;
                _this.progressline.css("width",dd);
                _this.progressdot.css("marginLeft",dd);
                //计算进度条比例
                var value = dd / $(this).width();
                Functions(value);
            });
        },

        //设置监听鼠标拖拽播放进度条
        promove:function (Functions) {
            var _this = this;
            this.progressdot.mousedown(function () {
                _this.tuozuaishi = true;
                _this.panDuanTaiQi = true;
                var offleft = _this.progressBar.offset().left;
                $(document).mousemove(function (event) {
                    var dd = event.pageX - offleft;
                    if (dd>=0 && dd<=770){
                        _this.progressline.css("width",dd);
                        _this.progressdot.css("marginLeft",dd);
                    }
                });
            });
            $(document).mouseup(function (event) {
                if (_this.panDuanTaiQi){
                    _this.tuozuaishi = false;
                    _this.panDuanTaiQi = false;
                    $(document).off('mousemove');
                    var ddd = event.pageX - _this.progressBar.offset().left;
                    var value = ddd / _this.progressBar.width();
                    Functions(value);
                }
            });
        },

        // //设置监听鼠标拖拽声音进度条
        shengmove:function (Functions) {
            var _this = this;
            this.progressdot.mousedown(function () {
                _this.panDuanTaiQi = true;
                var offleft = _this.progressBar.offset().left;
                $(document).mousemove(function (event) {
                    var dd = event.pageX - offleft;
                    if (dd>0 && dd<80){
                        _this.progressline.css("width",dd);
                        _this.progressdot.css("marginLeft",dd);
                    }
                });
            });
            $(document).mouseup(function (event) {
                if (_this.panDuanTaiQi) {
                    _this.panDuanTaiQi = false;
                    $(document).off('mousemove');
                    var ddd = event.pageX - _this.progressBar.offset().left;
                    var value = ddd / _this.progressBar.width();
                    Functions(value);
                }
            });
        }

    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);