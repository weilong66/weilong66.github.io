$(function () {

    $('#full-screen').on('click', function () {
        switchFullScreen(this);
    })

    $('.navbar-hide').on('click', function () {
        const $mainPanel = $('.main-panel').first(); // 获取主面板
        const $navbar = $mainPanel.children('nav').first(); // 获取导航条
        const $gamePage = $('.game-page').first(); // 获取导航条
        if ($navbar) {
            $navbar.hide();
            $gamePage.css('top', '0');
        }
    })

    /* 阻止触摸屏长按时间 */
    document.addEventListener('touchstart', function(event) {
        // 记录触摸开始的时间
        event.target.startTouchTime = new Date().getTime();
    }, { passive: false });
    
    document.addEventListener('touchend', function(event) {
        // 获取当前时间
        var endTouchTime = new Date().getTime();
        // 如果触摸持续时间很短，则认为不是长按
        if (endTouchTime - event.target.startTouchTime < 500) {
            return;
        }
        // 阻止默认行为，比如显示上下文菜单
        event.preventDefault();
    }, { passive: false });
    
    // 对于一些浏览器，可能还需要阻止contextmenu事件
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    }, { passive: false });
})

function switchFullScreen(element) {
    const $fullScreenIcon = $(element).children('i').first();
    if ($fullScreenIcon) {
        const $mainPanel = $('.main-panel').first(); // 获取主面板
        const $gamePage = $('.game-page').first(); // 获取游戏页面
        const $sidebar = $('.sidebar').first(); // 获取侧边栏
        if ($fullScreenIcon.hasClass('fa-expand')) {
            // console.log('游戏页面网页全屏');
            $(element).attr('title', '退出网页全屏');
            $fullScreenIcon.removeClass('fa-expand');
            $fullScreenIcon.addClass('fa-compress');
            $mainPanel.css('width', '100%');
            $gamePage.addClass('game-page-full');
            $sidebar.hide();//隐藏侧边栏
        } else {
            // console.log('游戏页面还原');
            $(element).attr('title', '网页全屏');
            $fullScreenIcon.removeClass('fa-compress');
            $fullScreenIcon.addClass('fa-expand');
            $mainPanel.css('width', '');
            $gamePage.removeClass('game-page-full');
            $sidebar.show();//显示侧边栏
        }
    }
}