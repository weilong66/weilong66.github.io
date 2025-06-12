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
var expirationTime = 1 * 60 * 1000; //单位毫秒

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
  // 查找浮动小部件容器
  let $floatingWidgetDiv = $(".floating-widget-div");

  if ($floatingWidgetIframe.length > 0) {
    //获取浮动小部件容器的display样式值
    let displayValue = $floatingWidgetDiv[0].style.display;
    if (displayValue === "block") {
      // 如果存在且为显示则禁用
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
  // 获取小部件容器
  let $floatingWidgetDiv = $(".floating-widget-div");
  if ($floatingWidgetDiv.length > 0) {
    console.log("禁用浮动小部件.");
    // 隐藏浮动小部件
    $floatingWidgetDiv.css('display', 'none');
    // 清除已有的定时器（如果存在），防止重复设定
    if (removeTimer !== null) {
      clearTimeout(removeTimer);
    }
    //设置新定时器，指定时间后移除以节省资源
    removeTimer = setTimeout(() => {
      // 清空浮动小部件内元素
      $floatingWidgetDiv.empty();
      // 移除后将定时器设为空
      removeTimer = null;
      console.log("浮动小部件长时间未启用，为节省资源已移除.")
    }, expirationTime);
  }
}

/* 启用 浮动小部件 函数 */
function enablefloatingWidget() {
  // 获取小部件
  let $iframe = $('iframe.floating-widget-iframe').first();
  // 获取小部件容器
  let $floatingWidgetDiv = $(".floating-widget-div");
  if ($iframe.length > 0) {
    console.log("启用浮动小部件.");
    //显示小部件
    $floatingWidgetDiv.css("display", "block");
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
    $iframe = document.createElement("iframe");
    // 设置 iframe 的属性
    $iframe.className = "floating-widget-iframe";
    $iframe.src = floatingWidgetUrl;
    $iframe.frameBorder = "0";
    $iframe.width = "400";
    $iframe.height = "300";
    $iframe.style.border = "none"; // 移除边框
    $iframe.style.display = "none"; // 默认隐藏

    // 显示“加载中”信息
    var errorMessage = document.createElement("div");
    errorMessage.textContent = "加载中...";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "16px"; // 设置字体大小
    errorMessage.style.fontWeight = "bold"; // 设置字体加粗
    errorMessage.style.paddingRight = "50px"; //设置内边距避免与其它元素重叠

    newDiv.append(errorMessage); //添加加载提示信息

    console.log("浮动小部件加载中...");

    //设置iframe加载完成后执行的函数
    $iframe.onload = function () {
      errorMessage.style.display = "none";
      $iframe.style.display = "block"; //显示小部件
      console.log("浮动小部件加载完成!");
    };
    // 设置iframe加载失败后执行的函数
    $iframe.onerror = function () {
      newDiv.style.display = "none"; //隐藏小部件容器
      $iframe.style.display = "none"; //隐藏小部件
      $(link).css("display", "none"); //隐藏切换小部件加载的超链接
      errorMessage.textContent = "加载失败";
      console.log("小部件加载失败: iframe.onerror");
    };

    //将小部件添加到的 <div>中
    $(newDiv).append($iframe);
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
      return "https://hammyhome.com?hh=('names!%255B'apMc6MbrMp1Mp1Mw2bMc1Mb1Mh2Mc9Mc4Mc4d5d5d5d6d6d5Mr1Mp1Mp2d5d5d5d5d3d3MswMchMhcMchMwb2Mp1Mr2Mr1Mh4Mb1Mwb2d3d3d6d3d5d3d6d3d5d3d4d2d5Mc4Mc1d5d5Mc1MbrMchMhcMb2Mwb2Mw2aMhMh'%255D~props!%255B('bp!'pawsMbc!'%2523C0C0C0Mx!1.6L5.05~z!-59.42G0L0RHDA82Pi'UUUUUU0V0L2RHPPPT1L2j-1L2j0L0R8_XPXT-2RL2RHE27A30i0G-2.75L2R5g2RL2R_AF5719IXC7XT3RL0RHP8282i'UUUUUUUU0V-2%25204%25200L6K-ST0L5KSO2L5KS*T1L6K-S***T1L5KST2L6KST4L3KW5L3j2RL2RHA7A7PT6L6K0J*k-2L7KYO-3L7KYO-4L6K3.14J*k6L7KY*T-4L7K-3.14J%252CO-2L4RHPPXI3838PT-0.9L4q-1L5vT2.7L4q1.85L3.9_N1~nh!1G5L1j4L2K-W4L1KW2.25L0R8_PPXT2RL2R4g3.15L4_N4~nh!1G6L2K0J*T6L4KY%252CO6L3K0Jk7L3K0J*T7L4K0J*T7L5KY*T6L5KYT-5L5K-3.14J*O-5L4K0JO-4L3K-Y%252CO-4RL2RK-YT-4L5K-Yk-4L4K0JT2%2524'UZZZZZ0V-0R%25240G4L7KYO5L7KYT-2RL0RHPPPi'1%252C1%252C1%252C1%252C1V2L6R5HPPPT1R8L6q3L7vT-0.75L6R5_C1B575IXPX%25221.15L8_N4~nh!1G4L4R5_XXPT-2RL3RHuIQeT2L2HuIQe')%255D)*IPPXG)%252C('x!H~c!'%2523I%252C%2523JHXPX*K~rz!L~y!M'~NBFBFBFI7F7PFIADADADI7F7PFIP7FXMwl!0.O%252CkPFFQXXXPIuIuMo!'c1%252Cc2%252Ccf%252Csn%252Cch%252CbR.5S1R7HP3838*T'GU0%252CVMbc!'%2523PFBAFTW0.79HE1DABBIC2B475TX00Y1R7JZ-0.05%252C_K0HdMtg_C1B575IA39347%2522iMbh!jRH82P82Tk%252C*Tq.7_P9933TuEC76XPv.75_PXX*IXPXIXXP%2520L4RHCF681Di0G%2522Mnf!0~nh!2G-%2524L6RH8282Pi%2501%2524%2522%2520vuqkjigd_ZYXWVUTSRQPONMLKJIHG*_";
    case "flsh":
      return "https://goldfishies.com/";
    case "penguin":
      return "https://www.petpenguins.com/";
    default:
      break;
  }
  return "";
}