//获取当前正在运行的脚本所属的 script 元素
const script = document.currentScript;
// 获取umamiId
const umamiId = script.getAttribute("data-website-id");

// 获取当前页面的URL并提取从第一个'.'之后的部分作为域名后缀
var currentUrl = new URL(window.location.href);
var hostname = currentUrl.hostname;
var domainParts = hostname.split('.');
// 查找第一个'.'的位置，并基于此构建自定义的第一个URL
var firstDotIndex = hostname.indexOf('.');
// 正则表达式用于匹配IPv4地址
var ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

var customDomainScriptUrl; //储存URL拼接结果
// 查找当前网站URL第一个'.'的位置，并基于此构建自定义的URL
var firstDotIndex = hostname.indexOf('.');
if (!ipv4Regex.test(hostname) && firstDotIndex !== -1) { // 确保找到了至少一个'.'
    var domainSuffix = hostname.substring(firstDotIndex); // 从第一个'.'之后开始截取
    var portPart = currentUrl.port ? ':' + currentUrl.port : ''; // 添加端口号（如果有）
    customDomainScriptUrl = 'https://umami' + domainSuffix + portPart + '/script.js';
} else {
    // 如果没有找到'.'，即不是域名的情况下，则直接使用原始根URL+拼接umami的本地端口（这里请改成你自己使用的端口）
    customDomainScriptUrl = 'http://' + hostname + ':3020' + '/script.js';
}

// 定义一个数组，首先添加动态拼接的脚本URL，接着是其他备用的脚本URL
var scriptUrls = [
    customDomainScriptUrl, // 动态拼接的脚本URL作为第1个
    "https://umami.weilong66.dynv6.net:8443/script.js", // 第1个URL
    "https://umami.dpdns.org:8443/script.js", // 第2个URL
    "https://umami.lan.cn:8440/script.js" // 第3个URL
];

// 加载脚本函数
function loadScript(urls, index) {
    // 检查索引是否超出范围，避免无限循环
    if (index >= urls.length) return;

    //检查当前索引的URL是否为空值，如果为空则直接尝试下一个URL
    if (!urls[index]) {
        loadScript(urls, index + 1);
        return;
    }

    var script = document.createElement('script');
    script.src = urls[index];
    script.defer = true; // 确保defer属性被设置
    script.setAttribute('data-website-id', umamiId);

    // 监听错误事件，如果发生错误，则尝试加载下一个URL
    script.onerror = function () {
        console.log('无法从该URL加载umami的网站统计脚本:', urls[index]);
        loadScript(urls, index + 1); // 尝试下一个URL
    };

    /* // 成功加载后的操作
    script.onload = function() {
        console.info("umami的网站统计脚本加载成功！")
    }; */

    // 将script标签插入到head中
    document.head.appendChild(script);
}

// 开始尝试加载第一个脚本URL
loadScript(scriptUrls, 0);