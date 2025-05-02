//按钮切换日/夜间模式
function switchNightMode() {
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if (night == '0') { //cookie中的night为0表示当前(或上次)为日间模式 ，因此切换为夜间模式
        enableNightMode();
    } else {
        enableSunMode();
    }
}

function enableNightMode() {
    document.body.classList.add('black');
    document.cookie = "night=1;path=/"
    console.log('切换夜间模式');
    // 将日夜切换按钮更改为切换日间按钮
    $(".switch-dark-mode").attr("title", "切换日间模式");
    $(".mode-ico").removeClass("fa-moon-o");
    $(".mode-ico").addClass("fa-sun-o");
}

function enableSunMode() {
    document.body.classList.remove('black');
    document.cookie = "night=0;path=/"
    console.log('切换日间模式');
    // 将日夜切换按钮更改为切换夜间按钮
    $(".switch-dark-mode").attr("title", "切换夜间模式");
    $(".mode-ico").removeClass("fa-sun-o");
    $(".mode-ico").addClass("fa-moon-o");
}


//初始化夜间(日间)模式
(function () {
    //判断当前会话的cookie中是否有night，如果没有则根据当前时间设置日夜模式
    if (document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") === '') {
        if (new Date().getHours() > 19 || new Date().getHours() < 6) {
            enableNightMode();
        } else {
            enableSunMode();
        }
    } else {
        var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
        if (night == '0') { //cookie中的night为0表示上次是日间模式 ，因此要切换为日间模式
            enableSunMode();
        } else {
            enableNightMode();
        }
    }
})();