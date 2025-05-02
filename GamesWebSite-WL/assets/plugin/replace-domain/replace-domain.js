$(document).ready(function () {
    replaceAHref("javascript-http//");
    replaceImgSrc("javascript-http//");
});


/**
 * 使用当前a标签中的//后的字符串替换当前域名中的子域名作为新域名，替换a标签中的href中的值
 * @param {string} prefix - 生效的URL前缀，只替换href值前缀为该参数值的a标签。
 */
function replaceAHref(prefix) {
    // 获取当前页面的根URL（含端口号）
    //  var currentUrl = window.location.origin; // 包括协议和主机名(含端口)
    var hostname = window.location.hostname;
    var port = window.location.port ? ':' + window.location.port : '';

    // 提取子域名部分
    // var subdomain = hostname.split('.')[0];

    var $hostPrefix = $('a[href^="' + prefix + '"]');

    $hostPrefix.each(function () {
        // 获取a标签的href属性
        var href = $(this).attr('href');
        // 提取href中"//"后面的部分作为新的子域名
        var newSubdomain = href.substring(prefix.length);

        // 构造新的URL（使用提取的新子域名 + 原一级域名 + 端口号）
        var newHostname = newSubdomain + '.' + hostname.substring(hostname.indexOf('.') + 1) + port;
        // 构造新的URL（使用协议 + 新构造的URL）
        var newUrl = window.location.protocol + "//" + newHostname;;
        // var newUrl = window.location.protocol + "//" + newHostname + window.location.pathname + window.location.search + window.location.hash;

        // 更新a标签的href属性
        $(this).attr('href', newUrl);
    });
}

/**
 * 使用当前img标签中的//后的字符串替换当前域名中的子域名作为新域名，替换img标签中的src中的值
 * @param {string} prefix - 生效的URL前缀，只替换src值前缀为该参数值的img标签的src值。
 */
function replaceImgSrc(prefix) {
    // 获取当前页面的根URL（含端口号）
    var hostname = window.location.hostname;
    var port = window.location.port ? ':' + window.location.port : '';

    // 选择所有符合条件的img标签
    var $imgs = $('img[data-src^="' + prefix + '"]');

    $imgs.each(function () {
        var src = $(this).attr('data-src');
        // 提取src中"//"和第一个"/"之间的部分作为新的子域名
        var match = src.substring(prefix.length).match(/([^\/]*)\/(.*)/);
        if (match && match[1]) {
            var newSubdomain = match[1];
            // 构造新的hostname
            var newHostname = newSubdomain + '.' + hostname.substring(hostname.indexOf('.') + 1) + port;
            // 组装新的src URL
            // var path = src.substring(src.indexOf('/') + 1); // 获得原始src中的路径部分
            var newSrc = window.location.protocol + "//" + newHostname + '/' + match[2];

            // 更新img标签的src属性
            $(this).attr('src', newSrc);
        }
    });
}