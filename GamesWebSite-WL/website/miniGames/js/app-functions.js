//按钮切换日/夜间模式
function switchNightMode() {
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if (night == '0') { //cookie中的night为0表示当前(或上次)为日间模式 ，因此切换为夜间模式
        enableNightMode();
        enableIframeNightMode();
    } else {
        enableSunMode();
        enableIframeSunMode();
    }
}

function enableNightMode() {
    // 给当前页面的 body 添加类名
    document.body.classList.add('io-black-mode');
    // 设置夜间模式的 cookie
    document.cookie = "night=1; path=/";
    // console.log('切换到夜间模式');
    // 将日夜切换按钮更改为切换日间模式
    var switchButton = document.querySelector("#switch-dark-mode");
    if (switchButton) {
        switchButton.title = "切换日间模式";
        var modeIcon = switchButton.querySelector(".mode-ico");
        if (modeIcon) {
            modeIcon.classList.remove("fa-moon-o");
            modeIcon.classList.add("fa-sun-o");
        }
    }
}

function enableSunMode() {
    // 给当前页面的 body 添加类名
    document.body.classList.remove('io-black-mode');
    // 设置夜间模式的 cookie
    document.cookie = "night=0; path=/";
    // console.log('切换到日间模式');
    // 将日夜切换按钮更改为切换日间模式
    var switchButton = document.querySelector("#switch-dark-mode");
    if (switchButton) {
        switchButton.title = "切换夜间模式";
        var modeIcon = switchButton.querySelector(".mode-ico");
        if (modeIcon) {
            modeIcon.classList.remove("fa-sun-o");
            modeIcon.classList.add("fa-moon-o");
        }
    }

}

function enableIframeNightMode() {
    // 获取 iframe 元素
    var iframe = document.getElementById('iframe-game-page');
    // 访问 iframe 的文档对象
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // 给 iframe 的 body 添加类名
    iframeDoc.body.classList.add('io-black-mode');
}

function enableIframeSunMode() {
    // 获取 iframe 元素
    var iframe = document.getElementById('iframe-game-page');
    // 访问 iframe 的文档对象
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // 给 iframe 的 body 添加指定类名
    iframeDoc.body.classList.remove('io-black-mode');
}

//初始化夜间(日间)模式
function initNightMode() {
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
}

function dragFooterTools() {
    // 获取 footer-tools 元素
    var footerTools = document.getElementById("footer-tools");
    // 获取本地存储的 footerToolsTop 值
    let footerToolsTop = localStorage.getItem('footerToolsTop');
    // 如果本地存储中有 footerToolsTop 值，则将其赋值给 footerTools 的 top 样式
    if (footerTools) {
        if (footerToolsTop) {
            footerTools.style.top = footerToolsTop;
        }

        // 给 footerTools 元素添加 mousedown 事件监听器
        footerTools.addEventListener("mousedown", function (event) {
            // 阻止默认行为
            event.preventDefault();
            footerTools.style.transition = "none"; // 移除过渡效果以实现平滑拖动

            var disY = event.clientY - footerTools.offsetTop;

            var move = function (event) {
                var newTop = event.clientY - disY; // 计算新的 top 值

                // 获取页面最大可拖动位置（防止拖出底部）
                var maxTop = window.innerHeight - footerTools.offsetHeight;

                // 边界限制
                if (newTop < 0) {
                    newTop = 0;
                } else if (newTop > maxTop) {
                    newTop = maxTop;
                }


                footerTools.style.left = "0px"; //把left设置为0px使其一直显示出来。
                footerTools.style.top = newTop + "px"; // 设置新的top值
            };

            document.addEventListener("mousemove", move);

            document.addEventListener("mouseup", function () {
                footerTools.style.removeProperty('left'); // 移除设置的 left 属性，使其正常使用css样式
                footerTools.style.transition = "0.5s"; // 恢复过渡效果
                document.removeEventListener("mousemove", move); // 移除 mousemove 事件监听器
                localStorage.setItem('footerToolsTop', footerTools.style.top); // 更新本地存储的 top 值
            });
        });
    }
}