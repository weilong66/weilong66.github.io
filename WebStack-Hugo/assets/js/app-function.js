function trigger_lsm_mini(expandSidebarAnim, sidebarParentScroll) {
    expandSidebarAnim = stringToBoolean(expandSidebarAnim);
    sidebarParentScroll = stringToBoolean(sidebarParentScroll);

    var isChecked = $('.header-mini-btn input[type="checkbox"]').prop("checked");
    if (!isChecked) { // 当前已最小化，执行展开操作
        $('.sidebar-nav').removeClass('mini-sidebar');
        $('.sidebar-menu ul ul').css("display", "none");

        // sidebarParentScroll为true时，将左导航父菜单的 href 属性设置为其 data-change 属性的值以实现点击滚动到页面对应位置
        if (sidebarParentScroll) {
            // 将每个左导航父菜单元素的 href 属性设置为其 data-change 属性的值以实现点击滚动到页面对应位置
            $('.sidebar-nav .change-href').each(function () {
                $(this).attr('href', $(this).data('change'));
            });
        } else {
            // 调整所有左导航父菜单元素,使点击图标锚定定位失效，防止页面跳动
            $('.sidebar-nav .change-href').attr('href', 'javascript:;');
        }
        adjustSidebar(170, expandSidebarAnim);
    } else { // 当前未最小化，执行最小化操作
        $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
        $('.sidebar-menu ul').removeAttr('style');
        $('.sidebar-nav').addClass('mini-sidebar');
        // 将每个左导航父菜单元素的 href 属性设置为其 data-change 属性的值以实现点击滚动到页面对应位置
        $('.sidebar-nav .change-href').each(function () {
            $(this).attr('href', $(this).data('change'));
        });
        adjustSidebar(60, expandSidebarAnim); // 最小化宽度固定为60
    }
}
// 辅助函数：用于调整侧边栏宽度和动画效果
function adjustSidebar(width, expandSidebarAnim) {
    if (expandSidebarAnim) {
        $('.sidebar-nav').addClass('animate-nav').stop().animate({
            width: width
        }, 200);
    } else {
        $('.sidebar-nav').removeClass('animate-nav').width(width);
    }
}
//工具函数，将字符串'true'和'false'转换为对应布尔值（并且忽略大小写）
function stringToBoolean(str) {
    if (typeof str === 'string') {
        return str.toLowerCase() === 'true';
    }
    return str === 'true';
}