/* 本地搜索功能*/
var maxLimit = 100; // 搜索结果最大长度

var resultSingleLiHeight = -1; //单行高度(包含内边距、外边距等)
var resultUlHeight = -1; //整个列表高度

// 启用本地搜索功能的代码
function getLocalSearch(parents) {
  // 使用防抖函数包裹搜索函数，设置延迟时间为300ms，并保存引用
  debounce(search(parents), 300);
}


// 定义一个防抖函数，避免频繁触发输入事件
function debounce(fn, delay) {
  var timer = null; // 定义一个定时器
  return function () {
    var context = this; // 保存this指向
    var args = arguments; // 保存参数
    clearTimeout(timer); // 清除上一次的定时器
    timer = setTimeout(function () {
      // 设置新的定时器
      fn.apply(context, args);
    }, delay); // 延迟时间
  };
}

//根据pinyin-pro匹配的下标，获取匹配到的字
function getMatchedWord(text, index) {
  // 如果下标是一个数字，就返回对应位置的字符
  if (index == Number(index)) {
    return text[index];
  }
  // 如果下标是一个数组，就返回对应范围的字符串
  if (Array.isArray(index)) {
    var result = "";
    for (var i = 0; i < index.length; i++) {
      result += text.charAt(index[i]);
    }
    return result;
  }
  return "";
}

// 封装本地搜索逻辑
function search(parents) {

  //获取搜索结果列表
  let $resultsList = parents.children(".search-smart-tips").children("ul");
  //清除搜索结果列表的内容
  $resultsList.text("");

  //    var keyword = this.value;
  //获取输入框文本
  var keyword = parents.children("form").find("input.smart-tips.search-key").val();
  // 检查输入框否为空或只包含空格
  if (keyword.trim() === "") {
    // 重置结果列表
    $resultsList.text("");
    return;
  }

  var xCards = document.getElementsByClassName("url-card");
  var results = []; // 存储匹配结果的数组
  let regex = new RegExp(keyword, "i"); // 'i' 标志表示不区分大小写
  if (typeof pinyinPro !== "undefined") {
    //https://pinyin-pro.cn/use/match.html
    var { match: pyMatch } = pinyinPro;
  }

  for (var i = 0; i < xCards.length; i++) {
    var cardLink = xCards[i].querySelector("a");
    // 获取a标签中class为overflowClip_1、2的文本内容
    var clipContent =
      cardLink.querySelector(".text-sm.overflowClip_1").textContent.trim() +
      " - " +
      cardLink.querySelector(".text-muted.text-xs").textContent.trim();
    var imgSrc = cardLink.querySelector("img").getAttribute("data-src");
    if (cardLink) {
      // 常规匹配
      let wordMatch = clipContent.match(regex);
      // 拼音匹配
      if (pyMatch !== undefined && /^[a-zA-Z0-9]/.test(keyword)) {
        var pinyinMatch = pyMatch(clipContent, keyword, {
          continuous: true,
          precision: "start"
        });
      }

      // 如果匹配有结果
      if (wordMatch || pinyinMatch) {
        // 将匹配的需要用到的内容 添加到结果数组中
        results.push({
          href: cardLink.href,
          text: clipContent,
          dataSrc: imgSrc,
          pyMatch: pinyinMatch,
          wdMatch: wordMatch
        });
      }
    }
  }

  $resultsList.text("");// 重置结果列表
  if (results.length > 0) {
    let defaultLogo = logosPath;
    tipsList = results.length;
    // 结果列表
    let listItem;
    for (let j = 0; j < results.length; j++) {
      if (results[j].wdMatch) {
        word = results[j].wdMatch[0];
      } else {
        word = getMatchedWord(results[j].text, results[j].pyMatch);
      }
      let highlight = "<strong>" + word + "</strong>";
      let newtext = results[j].text.replace(word, highlight);
      // 结果列表
      listItem = document.createElement("li");
      // 加一个img标签用于显示logo
      let newIcon = document.createElement("i");
      let img = document.createElement("img");
      img.classList.add("lazy");
      img.src = defaultLogo;
      img.setAttribute("data-src", results[j].dataSrc);
      img.setAttribute("onerror", `javascript:this.src='${defaultLogo}'`);
      newIcon.appendChild(img);
      // 添加a标签
      let newLink = document.createElement("a");
      newLink.href = results[j].href;
      newLink.innerHTML = newtext;
      newLink.target = "_blank";
      // 将新增元素加入到搜索结果列表
      listItem.appendChild(newIcon);
      listItem.appendChild(newLink);
      listItem.title = results[j].text; //设置标题，当鼠标放上时显示完整文本内容
      // 将 搜索结果列表 添加到 $resultsList 中
      $resultsList.append(listItem);
    }
    $("img.lazy").lazyload(); //设置站点logo懒加载
    //获取结果列表单行高度
    resultSingleLiHeight = $(listItem).outerHeight();
  } else {
    // 重置结果列表
    $resultsList.text("");
    $resultsList.append("<span>没有找到匹配的内容。</span>");
    parents.children(".search-smart-tips").slideDown(200);
  }

  //下滑显示搜索结果列表
  parents.children(".search-smart-tips").slideDown(200, function () {
    //获取ul的高度;(这里通过回调函数调用，避免ul未完全显示导致获取错误高度)
    resultUlHeight = $resultsList.outerHeight();
  });
}

// 计算字符串中的中文字符数量
function countChineseCharacters(str) {
  //使用正则表达式匹配中文(\u4e00-\u9fa5)和中文符号(\u3000-\u303F)
  return (str.match(/[\u4e00-\u9fa5\u3000-\u303F]/g) || []).length;
}

// 添加输入事件监听，使用防抖函数包裹搜索函数，设置延迟时间为300ms
// 改为手动启用，所以此处注释掉
// input.addEventListener("input", debounce(search, 300));

/*搜索按钮：打开搜索框*/
// document.getElementById('search-btn').addEventListener('click', function() {
//     var searchBox = document.getElementById('overlay');
//     if (searchBox.style.display === 'none') {
//     searchBox.style.display = 'block';
//     var inputElement = document.getElementById('search-input');
//     inputElement.focus();
//     } else {
//     searchBox.style.display = 'none';
//     }
// });
/*Ctrl+F：打开搜索框*/
// document.addEventListener('keydown', function(event) {
//     var searchBox = document.getElementById('overlay');
//     var inputElement = document.getElementById('search-input');
//     if (event.ctrlKey && event.key === 'f') { // CTRL+F
//         if (searchBox.style.display === 'none') {
//             searchBox.style.display = 'block';
//             inputElement.focus();
//             event.preventDefault(); // 阻止默认行为
//         }else{
//             searchBox.style.display = 'none';
//             event.preventDefault();
//         }
//     }
// });
/*点击空白处：关闭搜索框*/
// document.getElementById('overlay').addEventListener('click', function(event) {
//     var searchBox = document.getElementById('search-box');
//     if (!searchBox.contains(event.target)) {
//     // 点击的不是search-box本身或其子元素
//     this.style.display = 'none';
//     }
// });
/*搜索框关闭按钮*/
// document.getElementById('close-button').addEventListener('click', function(event) {
//      var searchBox = document.getElementById('overlay');
//      searchBox.style.display = 'none';
// });


/*
 let eventListenerKeydown;
// 绑定键盘事件的函数
function bindEventLocalSelectWords() {
  // 键盘事件：结果列表选择
  let index = -1; // 当前选中的索引
  //绑定键盘事件函数
  eventListenerKeydown = function(event) {
    
    // 如果按下 上箭头
    if (event.key === "ArrowUp") {
     
    }
    // 如果按下 下箭头
    if (event.key === "ArrowDown") {
      var height = items[0].offsetHeight; // 每个li的高度
      var visible = Math.floor($resultsList.clientHeight / height); // 可视区域内能显示的li的个数
      if (index == -1 || index == items.length - 1) {
        index = 0;
      } else {
        index++; // 否则，选中下一项
      }
      // 遍历所有的项，给选中的项添加高亮样式，其他项移除高亮样式
      for (var i = 0; i < items.length; i++) {
        if (i == index) {
          items[i].classList.add("highlight");
          // 如果选中的项在可视区域的第一个或者最后一个，就滚动到选中的项的位置
          if (i % visible == 0 || i % visible == visible - 1) {
            // 滚动到选中的项的位置
            items[i].scrollIntoView();
          }
        } else {
          items[i].classList.remove("highlight");
        }
      }
    }
    // 如果按下回车键
    if (event.key === "Enter") {
      event.preventDefault(); // 阻止默认行为
      // 如果当前有选中的项，就触发该项的链接的点击事件
      if (index != -1) {
        var link = items[index].getElementsByTagName("a")[0];
        link.click();
      }
    }
  };

  //绑定事件
    $('.search-key').on('click', eventListenerKeydown);
} 
// 解绑键盘事件的函数
function unbindEventLocalSelectWords() {
  if (eventListenerKeydown) {
    $('.search-key').off("keydown", eventListenerKeydown);
    eventListenerKeydown = null;
  }
  $(document).off("keydown", ".smart-tips.search-key");
}
*/
