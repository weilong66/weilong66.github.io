// 使用querySelector方法通过href属性查找<a>标签
var link = document.querySelector(
  'a[href="javascript-load-asteroidsa-script"]'
);

// 获取全局常量absURL的值（需要在页面中提前定义absURL常量并设置值）
const kickassBaseUrl = absURL + "assets/plugin/website-asteroidsa/kickass/";
var enableLocal = false;
// 检查是否找到了对应的<a>标签
if (link) {
  // 为找到的<a>标签添加点击事件监听器
  link.addEventListener("click", function (event) {
    event.preventDefault(); // 阻止默认的链接跳转行为

    //添加一个变量，如果加载在线版失败则设置为true，避免下次启用插件时仍然重复加载增加加载延迟
    if (enableLocal) {
      loadScript(kickassBaseUrl + "kickass-local.js");
    }else{
      // 检测网络连接状态，如果正常连接互联网，就加载在线版（kickass），反之加载本地版（kickass-local）。
      // kickass.js和kickass-local.js都做了本地化处理，区别在于，kickass-local用到资源尽量都下载到本地了，下载不了的则注释掉。因此kickass-local可以完全离线运行。
      //（在线版其实没网也能玩，但是不会显示得分板）
      var img = new Image();
      // 尝试加载一个外部图片来判断能否正常访问外网，这里选择加载KickAssApp的图片，这样如果加载成功说明能访问在线版的资源。
      img.src = "https://kickassapp.com/css/gfx/frontpage/controls.png";
      // 在图片加载完成后执行
      img.onload = function () {
        // 可以连接互联网，则加载在线版
        loadScript(kickassBaseUrl + "kickass.js");
      };
      // 在图片加载失败时执行
      img.onerror = function () {
        // 无法连接互联网，则加载本地版
        loadScript(kickassBaseUrl + "kickass-local.js");
        console.log("kickassApp站点似乎无法访问，WebsiteAsteroids插件改为使用本地版本.");
        enableLocal = true;
      };
    }

    function loadScript(src) {
      // 创建一个新的<script>元素
      var script = document.createElement("script");
      script.src = src; // 根据网络状况设置脚本源
      script.type = "text/javascript"; // 设置脚本类型

      // 将新创建的<script>元素添加到文档的<head>部分
      document.head.appendChild(script);

      console.log("彩蛋已加载"); // 在控制台输出加载成功的消息
    }
  });
} else {
  console.log("设置某个链接的url为javascript-load-asteroidsa-script的可以用来触发彩蛋加载");
}
