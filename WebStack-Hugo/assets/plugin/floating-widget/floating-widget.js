// 使用querySelector方法通过href属性查找<a>标签
var link = document.querySelector(
  'a[href="javascript-load-floating-widget-script"]'
);
//读取配置文件
const floatingWidgetConfig = JSON.parse(
  document.getElementById("floating-widget-config").textContent
);
const floatingWidgetState = floatingWidgetConfig.floatingWidgetState === "true";
var floatingWidgetUrl = getFloatingWidgetUrl(
  floatingWidgetConfig.floatingWidgetType
);

//小部件临时禁用时间上限（超时则移除小部件以节省资源）
var expirationTime = 1 * 60 * 1000;//单位毫秒

//如果配置中设置默认启用小部件，并且url不为空，则加载小部件。
if (floatingWidgetState && floatingWidgetUrl) {
  enablefloatingWidget();
}

// 检查是否找到了对应的<a>标签
if (link) {
  // 为找到的<a>标签添加点击事件监听器
  link.addEventListener("click", function (event) {
    event.preventDefault(); // 阻止默认的链接跳转行为

    // 检测网络连接状态，
    const img = new Image();
    // 尝试加载一个外部图片来判断能否正常访问外网
    img.src = "https://www.baidu.com/favicon.ico";
    // 在图片加载完成后执行
    img.onload = function () {
      // 可以连接互联网，则切换小部件加载/卸载
      if (floatingWidgetUrl) {
        togglefloatingWidget();
      } else {
        console.log("小部件类型错误或地址为空，请去后台修改。");
      }
    };
    // 在图片加载失败时执行
    img.onerror = function () {
      // 无法连接互联网，则不加载
      console.log("无法正常连接互联网，为避免错误不加载小部件");
      // 移除小部件控件（如果存在）
      let $floatingWidgetIframe = $("div.floating-widget");
      if ($floatingWidgetIframe.length > 0) {
        // 如果存在则销毁
        $floatingWidgetIframe.remove();
      }
    };
  });
} else {
  console.log("设置某个链接的url为javascript-load-floating-widget-script的可以用来启用/禁用'浮动小部件'");
}

/* 切换 浮动小部件 启用/禁用状态 */
function togglefloatingWidget() {
  // 查找浮动小部件元素
  let $floatingWidgetIframe = $("iframe.floating-widget-iframe");

  if ($floatingWidgetIframe.length > 0) {
    //获取浮动小部件的display样式值
    let displayValue = $floatingWidgetIframe[0].style.display;
    if (displayValue === "block") {
      // 如果存在且为隐藏则禁用
      disablefloatingWidget();
    } else {
      //反之启用
      enablefloatingWidget();
    }
  } else {
    //反之启用
    enablefloatingWidget();
  }
}

// 定义一个变量来保存定时器ID
var removeTimer = null;
/* 禁用 浮动小部件 函数 */
function disablefloatingWidget() {
  let $floatingWidgetIframe = $("iframe.floating-widget-iframe");
  if ($floatingWidgetIframe.length > 0) {
    console.log("禁用浮动小部件.");
    // 隐藏浮动小部件
    $floatingWidgetIframe.css('display', 'none');
    // 清除已有的定时器（如果存在），防止重复设定
    if (removeTimer !== null) {
      clearTimeout(removeTimer);
    }
    //设置新定时器，指定时间后移除以节省资源
    removeTimer = setTimeout(() => {
      // 移除浮动小部件
      $floatingWidgetIframe.remove();
      // 移除后将定时器设为空
      removeTimer = null;
      console.log("浮动小部件长时间未启用，为节省资源已移除.")
    }, expirationTime);
  }
}

/* 启用 浮动小部件 函数 */
function enablefloatingWidget() {
  // 获取小部件
  let iframe = $('iframe.floating-widget-iframe').first();
  if (iframe.length > 0) {
    console.log("启用浮动小部件.");
    //显示小部件
    iframe.css("display", "block");
    // 如果有正在等待执行的移除操作，则清除定时器
    if (removeTimer !== null) {
      clearTimeout(removeTimer);
      removeTimer = null;
    }
  } else {
    console.log("开始加载浮动小部件.");

    // 获取放置小部件的<div>容器
    let newDiv = $('.floating-widget-div').first();
    newDiv.css("display", "block");

    //小部件 控件
    // 创建一个<iframe> 元素
    iframe = document.createElement("iframe");
    // 设置 iframe 的属性
    iframe.className = "floating-widget-iframe";
    iframe.src = floatingWidgetUrl;
    iframe.frameBorder = "0";
    iframe.width = "400";
    iframe.height = "300";
    iframe.style.border = "none"; // 移除边框
    iframe.style.display = "none"; // 默认隐藏

    // 显示“加载中”信息
    var errorMessage = document.createElement("div");
    errorMessage.textContent = "加载中...";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "16px"; // 设置字体大小
    errorMessage.style.fontWeight = "bold"; // 设置字体加粗
    errorMessage.style.paddingRight = "50px";//设置内边距避免与其它元素重叠

    newDiv.append(errorMessage);//添加加载提示信息

    console.log("浮动小部件加载中...");

    //设置iframe加载完成后执行的函数
    iframe.onload = function () {
      errorMessage.style.display = "none";
      iframe.style.display = "block";//显示小部件
      console.log("浮动小部件加载完成!");
    };
    // 设置iframe加载失败后执行的函数
    iframe.onerror = function () {
      newDiv.style.display = "none";//隐藏小部件容器
      iframe.style.display = "none";//隐藏小部件
      $(link).css("display", "none");//隐藏切换小部件加载的超链接
      errorMessage.textContent = "加载失败";
      console.log("小部件加载失败: iframe.onerror");
    };

    //将小部件添加到的 <div>中
    $(newDiv).append(iframe);
  }
}

/* 新标签页中打开iframe的url */
function openIframeURL() {
    // 打开新页面
    window.open(floatingWidgetUrl, '_blank'); // 在新标签页中打开
}

//根据传参返回
function getFloatingWidgetUrl(type) {
  switch (type) {
    case "hamster":
      return "https://hammyhome.com?hh=('names!%255B'apNc6NbrNp1Np1Nw2bNc1Nb1Nc1Nh2Nc9Nc4Nc4VVVNt6Nt6VNr1Np1Np2Nt6VVVVVVVVVNt3Nt3VVNswNw1aNchNhcNchNt6Nwb2Nt6Nt3VNp1Nr2Nr1Nt3VNt6Nh4Nb1Nwb2NhNh'%255D~props!%255B('bp!'pawsNbjC0C0C0Nx!0.62L3.2~z!-46.36G0L0WHDA82Ok'M0L2WHOOOS1L2d-1L2d0L0W8XZOZS-vHE27A30k0G-2.75L2W5i1~nh!2G-2WL0WHOOOk'uuuu1NbjOFBAFS-vXAF5719JZC7ZS3WL0WHO8282k'__M-2%25200G4%2520'M0L6K-QS0L5KQ%252CY2L5KQ*S1L6K-Q***S1L5KQS2L6KQS4L3KT5L3dvHA7A7OS6L5K-3.14Hg*Y6L6K0R*S3I2I1I0I-1I-2I-3I-4L6K3.14R*Y6%2522*S-4L7K-3.14R%252C%252CY4I5%2522S-2L4WHOOZJ3838OS4L4W8XOOCCJ8CZC7JF0CCOJOOCCS-1WL4.7XO9933S-1L5.75XOZZ*JZOZJZZOS4.02L4.76XO9933S-4L5Xg%252CY1.85L3.9XU1~nh!1G-4L3Xg*Y-4L2K-1W7RS-4L4K0RS5L1d4L2K-T4L1KT6L2K0R*S6L3Xg*S6L4K-3.14HgS2.25L0W8XOOZSv4i0~nh!2G-3.15L4XU4~nh!1G3L1WHqJPeS-2L3.1HqJPe')%255D)*JOOZG)%252C('x!H~jI%2522%252CYJ%252C%2523K~rz!L~y!M______0NbjOFBAFSN'~OFFPZZZOJqJqNo!'cuc2%252Ccf%252Csn%252Cch%252CbQ1W7HO3838*RHZOZ*S'GT0.79HE1DABBJC2B475SUBFBFBFJ7F7OFJADADADJ7F7OFJO7FZNwl!0.VNt5W.5XK0HY%252C*SZ00_0%252CdWH82O82Sg13O13*iXC1B575JA39347Nnf!jc!'%2523kNbh!qEC76ZOu1%252Cv2WL2W%2520L4WHCF681Dk%2522L7K1W7R%2501%2522%2520vuqkjigd_ZYXWVUTSRQPONMLKJIHG*_";
      break;
    case "flsh":
      return "https://goldfishies.com/";
      break;
    case "penguin":
      return "https://www.petpenguins.com/";
      break;
    default:
      break;
  }
  return "";
}

