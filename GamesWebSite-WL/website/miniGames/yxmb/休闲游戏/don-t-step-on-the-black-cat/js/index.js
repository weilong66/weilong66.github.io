$(function () {
    //判断该页面是否是被嵌入到一个<iframe>中（因为如果通过iframe引入，似乎当对应网站也实现兼容移动端时，再重复兼容反而会有问题）
    if (window.top !== window.self) {
        const $info = $('.info')
        $info.addClass('isPC')
        $('html').css({
            fontSize: '35px'
        })
    } else {
        // 判断是否是PC端
        if (!navigator.userAgent.match(/mobile/i)) {
            const $info = $('.info')
            $info.addClass('isPC')
            $('html').css({
                fontSize: '35px'
            })
        } else {
            const $textItems = $('.textItems')
            $textItems.each(i => $textItems.eq(i).addClass('isPhone'))
            $('html').css({
                fontSize: '105px'
            })
        }
    }
    //开始游戏
    startGame();
    //绘制五组方块
    let $map = $(".map");
    for (let i = 0; i <= 4; i++) {
        setBlock($map);
    }
    //方块位置初始化
    groupPosition();

});
//======================公共模块开始==========================

//开始游戏
function startGame() {
    //找到开始界面
    let $start = $("#start");
    //找到帮助按钮
    let $helpBtn = $(".helpBtn");
    //找到帮助菜单
    let $help = $(".help");
    //点击帮助按钮时显示帮助菜单
    $helpBtn.click(function () {
        $help.fadeIn(500);
        $help.click(function () {
            $(this).slideUp(300);
        })
    });

    //点击开始按钮时隐藏开始界面 并弹出音效选择界面
    $(".start").click(function () {
        $(this).fadeOut();
        let $checkMusic = $(".checkMusic");
        let $checkModel = $(".checkModel");
        $checkModel.css("display", "flex");
        $checkModel.children().click(function () {
            $(this).addClass("checkedModel");
            $(this).parent().fadeOut();
            $checkMusic.css("display", "flex");
            $checkMusic.children().click(function () {
                $(this).addClass("checked");
                $(this).parent().fadeOut();
                //让开始界面下滑消失
                $start.slideUp();
                if ($checkMusic.children(".piano").hasClass("checked")) {
                    music();
                } else {
                    musicTwo();
                }
                //模式检测
                checkModel()
            })
        });
    });
}

//模式选择
function checkModel() {
    let $map = $(".map");
    //方块点击检测
    if ($(".checkModel").children(".tradition").hasClass("checkedModel")) {
        ($(".group").eq(3).children(".bgColor")).addClass("startBtn");
        //底部方块组初始化
        checkBlock($map);
        bottomStyle();
    } else {
        //给要点击的方块设置引导手势
        ($(".group").eq(4).children(".bgColor")).addClass("startBtn current");
        $("body").on("click", ".startBtn", function () {
            groupPosition3();
            setBlockTwo();
        });

        //8s-14s之间任意时间间隔闪电
        let max = 14000;
        let min = 8000;
        let rand = parseInt(Math.random() * (max - min + 1) + min);
        linghtning(rand);

        checkBlockTwo();
    }
}

//钢琴音效
function music() {
    //找到所有音效 并设置一个0-6的随机数
    let max = 6;
    let min = 0;
    let rand = parseInt(Math.random() * (max - min + 1) + min);
    let $music = $("audio");
    //找到一个随机音效
    let currentMusic = $music.get(rand);
    //播放随机音效(调用cloneNode()使音效可以叠加)
    currentMusic.cloneNode().play();
}

//键盘音效
function musicTwo() {
    let $music = $("audio");
    let currentMusic = $music.get(8);
    currentMusic.cloneNode().play();

}


//======================公共模块结束==========================


//========================经典模式开始========================

//底部方块组初始化
function bottomStyle() {
    //设置随机颜色
    let max = 100;
    let min = 0;
    let rand1 = parseInt(Math.random() * (max - min + 1) + min);
    let rand2 = parseInt(Math.random() * (max - min + 1) + min);
    let rand3 = parseInt(Math.random() * (max - min + 1) + min);
    //边框颜色取反色
    let invert1 = 255 - rand1;
    let invert2 = 255 - rand2;
    let invert3 = 255 - rand3;
    let $bottomBlock = $(".group").eq(4).children();
    ($bottomBlock.css("background", `rgb(${rand1},${rand2},${rand3})`));
    ($bottomBlock.css("borderColor", `rgb(${invert1},${invert2},${invert3})`));
    ($bottomBlock.eq(0).text("别"));
    ($bottomBlock.eq(1).text("踩"));
    ($bottomBlock.eq(2).text("小"));
    ($bottomBlock.eq(3).text("黑"));
}

//生成一组方块的方法
function setBlock($map) {
    $map.prepend("<div class='group'>" +
        "<div class='block'></div>" +
        "<div class='block'></div>" +
        "<div class='block'></div>" +
        "<div class='block'></div>" +
        "</div>");
    let max = 3;
    let min = 0;
    let rand = parseInt(Math.random() * (max - min + 1) + min);
    let $thisBlock = $(".group").children().eq(rand);
    $thisBlock.addClass("bgColor");
    $thisBlock.addClass("flag");
}

//方块组位置初始化
function groupPosition() {
    let $group = $(".group");
    $group.eq(4).css("bottom", "0%");
    $group.eq(3).css("bottom", "25%");
    $group.eq(2).css("bottom", "50%");
    $group.eq(1).css("bottom", "75%");
    $group.eq(0).css("bottom", "100%");
}

//方块检测方法
let Timer = null;
let myTime = null;
let score;
let timeNum = 6;

function checkBlock($map) {
    clearInterval(Timer);
    clearInterval(myTime);
    //设置初始分数
    score = 0;
    //设置方块变色备用值
    let num = 220;
    let num2 = 0;
    let num3 = 80;
    let num4 = 255;
    let $textItem = $(".textItems");
    let $mapWidth = $(".map").width();
    let $width = $mapWidth * 0.05;
    Time($mapWidth);

    function Time($mapWidth) {
        Timer = setInterval(function () {
            $mapWidth -= $width;
            $(".time").css("width", $mapWidth + "px");
        }, 1000);
    }
    let $timer = $(".time");
    $timer.show();

    //利用事件委托给方块添加点击事件
    $("body").on("click", ".block", function () {
        //方块颜色判定
        if ($(this).hasClass("bgColor") && $(this).parent().index() === 3) {
            //生成新的一组方块
            setBlock($map);
            // 初始化位置
            groupPosition2();

            //点击事件发生时播放游戏音效
            let $checkMusic = $(".checkMusic");
            //判断玩家选择的音效并播放
            if ($checkMusic.children(".piano").hasClass("checked")) {
                music();
            } else {
                musicTwo();
            }

            //加分
            score += 1;
            //让方块随着分数的增高先变黄再变红后变蓝

            if (score < 110) {
                let $block = $(".group").children(".bgColor");
                $block.css("background", `rgb(${score*2},${score*2},${0})`);
                if (score === 50) {
                    $textItem.eq(0).fadeIn();
                    setTimeout(function () {
                        $textItem.eq(0).fadeOut();
                    }, 2000)
                }
            } else if (score >= 110 && score < 180) {
                let $block = $(".group").children(".bgColor");
                num -= 2;
                $block.css("background", `rgb(${score*2},${num},${0})`);
                if (score === 155) {
                    $textItem.eq(1).fadeIn();
                    setTimeout(function () {
                        $textItem.eq(1).fadeOut()
                    }, 2000)
                }
            } else if (score >= 180 && score <= 280) {
                let $block = $(".group").children(".bgColor");
                num2 += 2;
                num3 -= 2;
                num4 -= 6;
                $block.css("background", `rgb(${num4},${num3},${num2})`);
                if (score === 265) {
                    $textItem.eq(3).slideDown();
                    setTimeout(function () {
                        $textItem.eq(3).slideUp();
                        $textItem.eq(4).slideDown();
                        setTimeout(function () {
                            $textItem.eq(4).slideUp();
                            $textItem.eq(5).slideDown();
                            setTimeout(function () {
                                $textItem.eq(5).slideUp();
                                $textItem.eq(6).fadeIn();
                                setTimeout(function () {
                                    $textItem.eq(6).fadeOut();
                                }, 8000)
                            }, 3000)
                        }, 3000)
                    }, 4000);
                }
            }
            //如果玩家分数超过280 则会开启彩虹模式
            else {
                if (score === 450) {
                    $textItem.eq(7).fadeIn();
                    setTimeout(function () {
                        $textItem.eq(7).fadeOut();
                        $textItem.eq(8).fadeIn();
                        setTimeout(function () {
                            $textItem.eq(8).fadeOut();
                            $textItem.eq(9).fadeIn();
                            setTimeout(function () {
                                $textItem.eq(9).fadeOut();
                                setTimeout(function () {
                                    $textItem.eq(10).fadeIn();
                                    setTimeout(function () {
                                        $textItem.eq(10).fadeOut();
                                    }, 5000)
                                }, 5000)
                            }, 5000)
                        }, 3000)
                    }, 4000)
                }
                //随机颜色
                let max = 200;
                let min = 0;
                let maxIndex = 0;
                let minIndex = 3;
                let randIndex = parseInt(Math.random() * (maxIndex - minIndex + 1) + minIndex);
                let rand1 = parseInt(Math.random() * (max - min + 1) + min);
                let rand2 = parseInt(Math.random() * (max - min + 1) + min);
                let rand3 = parseInt(Math.random() * (max - min + 1) + min);
                let $randBlock = $(".group").eq(randIndex).children(".bgColor");
                $randBlock.css("background", `rgb(${rand1},${rand2},${rand3})`);
                $(".map").css("background", `rgb(${rand1},${rand2},${rand3})`);
            }

            //设置被点击的方块变成灰色时添加盒子阴影 并让其所在的方块组下移25%
            $(this).css({
                backgroundColor: "#ddd",
                // boxShadow:`inset ${0} ${0} ${200}px #000`
            });

            //0.5s后删除超出去的方块组(优化性能)
            setTimeout(function () {
                $(".group").eq(5).remove();
            }, 500);

            //奖励机制
            if (score === 30 || score === 65 || score === 105 || score === 150 || score === 200 || score === 255 || score === 311 || score === 368 || score === 426 || score === 486) {
                clearInterval(Timer);
                $(".time").css("width", $mapWidth);
                $textItem.eq(11).fadeIn();
                setTimeout(function () {
                    $textItem.eq(11).fadeOut();
                }, 1000);
                Time($mapWidth);
                $(".clock").fadeOut();
                //播放恢复时间音效
                let reTime = document.querySelector(".reTime");
                reTime.play();
                //停止倒计时音效
                let TimeClock = document.querySelector(".TimeClock");
                TimeClock.pause();
                //重置倒计时
                timeNum = 6;
            }
            return score;
        }

        //设置无法点击非第三排的黑色方块和已经点过的方块(优化用户体验)
        else if (($(this).hasClass("bgColor") && $(this).parent().index() !== 3) || $(this).parent().index() === 4) {
            return false;
        } else {
            clearInterval(Timer);
            clearInterval(myTime);
            $(".mask").show();
            setTimeout(function () {
                $(".mask").hide();
            }, 800);

            //若点击了非黑色方块 则出现生气的小黑
            $(this).addClass("miss");

            //给地图加入淡黄色内阴影
            $(".map").css("boxShadow", `inset ${0} ${0} ${300}px lightgoldenrodyellow`);

            //播放游戏失误音效
            let overMusic = document.querySelector(".over");
            let overMusicTwo = document.querySelector(".musicTwoOver");
            let $checkMusic = $(".checkMusic");
            if ($checkMusic.children(".piano").hasClass("checked")) {
                overMusic.play();
            } else {
                overMusicTwo.play()
            }

            //把最终得分添加到结束面板
            $("#score").text(score);

            //延迟0.5s出现结算界面
            setTimeout(function () {

                $("#over").slideDown();

                //重置分数
                score = 0;

                //重置时间条
                let $timer = $(".time");
                let $timeWidth = $map.width();
                $timer.css("width", $timeWidth);
                $timer.show();
            }, 500);
            //放置重新开始函数 等待用户调用
            restart();
        }
    });

    //时间条判定
    myTime = setInterval(function () {
        let $clock = $(".clock");
        let $timerWidth = $(".time").width();
        let $mapWidth = $(".map").width();
        let $clockTime = $mapWidth * 0.25;
        //如果时间还剩5秒
        if ($timerWidth <= $clockTime) {
            let TimeClock = document.querySelector(".TimeClock");
            TimeClock.play();
            //闹钟出现并开始倒计时
            $clock.fadeIn();
            timeNum -= 1;
            let num = timeNum;
            $clock.text(num + "s");
            setTimeout(function () {
                $clock.fadeOut();
            }, 5000)
        }
        if ($timerWidth === 0) {
            clearInterval(myTime);
            clearInterval(timer);
            let $timer = $(".time");
            $timer.hide();
            $(".mask").show();
            setTimeout(function () {
                $(".mask").hide();
            }, 800);

            //播放时间到音效
            let TimeOver = document.querySelector(".timeOver");
            TimeOver.play();

            //把最终得分添加到结束面板
            $("#score").text(score);

            //延迟0.5s出现结算界面
            setTimeout(function () {

                $("#over").slideDown();

                //重置分数
                score = 0;

                //重置倒计时
                timeNum = 6;

                //重置时间条
                let $timer = $(".time");
                $timer.show();
                let $timeWidth = $map.width();
                $timer.css("width", $timeWidth);

            }, 500);
            //放置重新开始函数 等待用户调用
            restart();
        }
    }, 1000);
}

//点击后更新方块组位置
function groupPosition2() {
    let $group = $(".group");
    $group.eq(5).css("bottom", "-25%");
    $group.eq(4).css("bottom", "0%");
    $group.eq(3).css("bottom", "25%");
    $group.eq(2).css("bottom", "50%");
    $group.eq(1).css("bottom", "75%");
    $group.eq(0).css("bottom", "100%");
}

//重新开始
function restart() {
    $(".restart").click(function () {

        //找到所有存在的方块组
        let $group = $(".group");

        //删除存在的方块组
        $group.remove();

        //关闭结束界面
        $("#over").slideUp();

        //重新绘制方块
        let $map = $(".map");
        for (let i = 0; i <= 4; i++) {
            setBlock($map);
        }
        //去除地图内阴影

        $map.css({
            boxShadow: "none",
            background: "#fff"
        });
        //漂浮文字位置归位
        let $textItems = $(".textItems");
        $textItems.hide();
        //初始化方块位置
        groupPosition();
        ($(".group").eq(3).children(".bgColor")).addClass("startBtn");
        //底部方块组初始化
        bottomStyle();
        //调用方块判断方法
        checkBlock($map);
    })
}

//========================经典模式结束========================

//========================滚动模式开始========================

let timer = null;
let time = null;
let lightningTime = null;
//滚动模式速度调节模块
function groupPosition3() {
    clearInterval(timer);
    timer = setInterval(function () {
        let $group = $(".group");
        for (let i = 0; i < $group.length; i++) {
            let bottom = parseFloat($group.eq(i).css("bottom"));
            let height = $group.eq(i).height();
            let step = height * 0.0125;
            bottom -= step;
            $($group).eq(i).css("bottom", bottom + "px");
        }
    }, 5);
}

//滚动模式新建方块组方法
function setBlockTwo() {
    clearInterval(time);
    time = setInterval(function () {
        let $map = $(".map");
        setBlock($map);
        let $group = $(".group");
        let preBottom = parseFloat($group.first().next().css("bottom")) + $group.height();
        $group.first().css("bottom", preBottom);
    }, 400);
}

//滚动模式方块检测方法
function checkBlockTwo() {
    let myTime = null;
    //设置初始分数
    score = 0;
    //监测
    $("body").on("click", ".block", function () {
        //关闭存在的定时器 防止叠加
        clearInterval(myTime);
        //加分
        score += 1;
        //失误后的操作
        function over() {
            let lightning = document.querySelector(".lightning");
            lightning.pause();
            //关闭所有定时器
            clearInterval(timer);
            clearInterval(time);
            clearInterval(lightningTime);
            //给地图加入淡黄色内阴影
            $(".map").css("boxShadow", `inset ${0} ${0} ${300}px lightgoldenrodyellow`);

            //把最终得分添加到结束面板
            let currentScore = score;

            $("#score").text(currentScore);

            //延迟0.5s出现结算界面
            setTimeout(function () {

                $("#over").slideDown();

                //重置分数
                score = 0;

            }, 800);

            //提供重新开始函数,供玩家调用
            restartTwo();
        }

        //判断超出地图
        myTime = setInterval(function () {
            let $group = $(".group");
            let height = $group.height();
            for (let i = 0; i < $group.length; i++) {
                let bottom = parseFloat($group.eq(i).css("bottom"));
                let flag = $group.eq(i).children(".bgColor").hasClass("flag");
                if (bottom < -height) {
                    if (flag) {
                        //关闭闪电特效 关闭闪电声音
                        let lightning = document.querySelector(".lightning");
                        lightning.pause();
                        clearInterval(lightningTime);
                        //超出地图后 遍历当前地图上所有方块组
                        let $group = $(".group");
                        //让最后一组方块的黑方块变成红色闪烁
                        $group.last().children(".bgColor").css("background", "rgb(255, 30, 0)");
                        setTimeout(function () {
                            $group.last().children(".bgColor").css("background", "rgb(255,148,163)");
                            setTimeout(function () {
                                $group.last().children(".bgColor").css("background", "rgb(255, 30, 0)");
                            }, 200)
                        }, 300);

                        $group.css("transition", `bottom ${.3}s ease-in `);
                        //让每个方块组的位置倒退一格
                        for (let j = 0; j < $group.length; j++) {
                            let currentBottom = parseFloat($group.eq(j).css("bottom"));
                            $group.eq(j).css("bottom", currentBottom + (1.2 * height));
                        }
                        //播放失误音乐
                        //播放游戏失误音效
                        let overMusic = document.querySelector(".over");
                        let $checkMusic = $(".checkMusic");
                        let overMusicTwo = document.querySelector(".musicTwoOver");
                        if ($checkMusic.children(".piano").hasClass("checked")) {
                            overMusic.play();
                        } else {
                            overMusicTwo.play()
                        }
                        clearInterval(myTime);
                        over();
                        $(".mask").show();
                        setTimeout(function () {
                            $(".mask").hide();
                        }, 1000);
                    } else {
                        setTimeout(function () {
                            $($group).eq(i).remove();
                        }, 10);
                    }
                }
            }
        }, 100);

        //判断点击失误
        let flag = $(this).hasClass("bgColor");
        let current = $(this).hasClass("current");
        if (!flag) {

            $(".mask").show();
            setTimeout(function () {
                $(".mask").hide();
            }, 1000);

            //若点击了非黑色方块 则出现生气的小黑
            $(this).addClass("miss");
            over();
            //播放游戏失误音效
            let overMusic = document.querySelector(".over");
            let overMusicTwo = document.querySelector(".musicTwoOver");
            let $checkMusic = $(".checkMusic");
            if ($checkMusic.children(".piano").hasClass("checked")) {
                overMusic.play();
            } else {
                overMusicTwo.play()
            }
        }
        //若点击了没有current类名的黑色方块 则无法点击(此方法可以让用户只能按顺序点击方块)
        else if (flag && !current) {
            return false;
        }
        //点击了正确的方块
        else {
            //删除以前设置过的标记用的类名
            $(this).removeClass("flag");
            //给当前元素的父元素的前一个元素的子元素添加current类名(类名传递);
            $(this).parent().prev().children(".bgColor").addClass("current");
            //删除当前类名
            $(this).removeClass("current");
            //给当前点击的方块添加类名让其边城灰色
            $(this).css({
                backgroundColor: "#ccc"
            });
            //点击事件发生时播放游戏音效
            let $checkMusic = $(".checkMusic");
            //判断玩家选择的音效并播放
            if ($checkMusic.children(".piano").hasClass("checked")) {
                music();
            } else {
                musicTwo();
            }
        }
    });

}

//闪电特效
function linghtning(Time) {
    clearInterval(lightningTime);
    lightningTime = setInterval(function () {
        let mapColor = $(".map");
        let lightning = document.querySelector(".lightning");
        lightning.play();
        mapColor.css("backgroundColor", "rgb(255, 255, 255)");
        setTimeout(function () {
            mapColor.css("backgroundColor", "rgb(0, 0, 0)");
            setTimeout(function () {
                mapColor.css("backgroundColor", "rgb(255, 255, 255)");
                setTimeout(function () {
                    mapColor.css("backgroundColor", "rgb(0, 0, 0)");
                    setTimeout(function () {
                        mapColor.css("backgroundColor", "rgb(255, 255, 255)");
                        setTimeout(function () {
                            mapColor.css("backgroundColor", "rgb(0, 0, 0)");
                            setTimeout(function () {
                                mapColor.css("backgroundColor", "rgb(255, 255, 255)");
                            }, 200)
                        }, 200)
                    }, 200)
                }, 400)
            }, 1000)
        }, 1000)
    }, Time);
}

//滚动模式重新开始
function restartTwo() {
    $(".restart").click(function () {
        //找到所有存在的方块组
        let $group = $(".group");

        //删除存在的方块组
        $group.remove();

        //关闭结束界面
        $("#over").slideUp();

        //重新绘制方块
        let $map = $(".map");
        for (let i = 0; i <= 4; i++) {
            setBlock($map);
        }
        //去除地图内阴影

        $map.css({
            boxShadow: "none",
            background: "#fff"
        });

        //漂浮文字位置归位
        let $textItems = $(".textItems");
        $textItems.hide();

        //初始化方块位置
        groupPosition();

        //给要点击的方块设置引导手势
        ($(".group").eq(4).children(".bgColor")).addClass("startBtn current");

        //8s-14s之间任意时间间隔闪电
        let max = 14000;
        let min = 8000;
        let rand = parseInt(Math.random() * (max - min + 1) + min);
        linghtning(rand);
    })
}

//========================滚动模式结束========================


//联系方式
(function () {
    console.log("作者:Mr.朱");
    console.log("qq:1136116938");
    console.log("GitHub地址:https://github.com/webdog369");
    console.log("本作品图片,音频素材来源于网络,非商用");
    console.log("版本号:v4.0");
})();