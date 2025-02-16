// 是否启用本地搜索tips
var enableLocalSearch = true;

// 搜索模块 -----------------------
function intoSearch() {
  //初始化搜索框

  /* 从本地缓存取出上次选择的搜索分类和标签（个人更喜欢不记住上次选择，所以这里注释掉）
         if (window.localStorage.getItem("searchlist")) {
            $(".hide-type-list input#" + window.localStorage.getItem("searchlist")).prop('checked', true);
            $(".hide-type-list input#m_" + window.localStorage.getItem("searchlist")).prop('checked', true);
        }
        if (window.localStorage.getItem("searchlistmenu")) {
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id=" + window.localStorage.getItem("searchlistmenu") + "]").addClass('active');
        } 
        */

  toTarget($(".s-type-list.big"), false, false);
  $(".hide-type-list .s-current").removeClass("s-current");
  //查找默认选中的搜索框标签(type)
  let inputTypeChecked = $('.hide-type-list input:radio[name="type"]:checked');
  inputTypeChecked.parents(".search-group").addClass("s-current");//设置分组为默认搜索类型所在分组
  //查找默认选中的悬浮搜索框标签(type2)
  let inputType2Checked = $('.hide-type-list input:radio[name="type2"]:checked');
  inputType2Checked.parents(".search-group").addClass("s-current");//设置分组为默认搜索类型所在分组

  //设置搜索框的搜索URL；这里假设所有搜索框默认选中同一种搜索，所以设置悬浮搜索框的值给所有搜索框。
  if ($(".super-search-fm").length > 1) {
    $(".super-search-fm").each(function (index, element) {
      let checkedInput = $('.hide-type-list input:radio:checked').eq(index);//匹配当前选中的搜索类型的input元素。
      $(element).attr("action", checkedInput.val());//设置搜索框的foram元素的action属性
      $(element).children('input').attr("placeholder", checkedInput.data("placeholder"));//设置搜索框的input元素的占位符属性
      //如果当前选中的搜索类型值为"javascript:local-search"则禁用搜索按钮
      if (checkedInput.val() === "javascript:local-search") {
        $(element).children('button').attr("disabled", true);
      }
    });
  }

  /* 如果当前匹配的input的value值为javascript:local-search，
    启用本地搜索 */
  enableLocalSearch = inputType2Checked.first().val() === "javascript:local-search";

}
//绑定搜索框分类点击事件，当点击搜索框上的某个分类时切换其下面的搜索label
$(document).on("click", ".s-type-list label", function (event) {
  //event.preventDefault();

  // 移除所有 .s-type-list.big label 元素的 active 类
  $(".s-type-list.big label").removeClass("active");
  // 为当前点击的分类标签添加 active 类
  $(this).addClass("active");
  // 找到当前分类标签的祖先元素 .s-search
  var parent = $(this).parents(".s-search");
  // 移除祖先元素中所有 .search-group 元素的 s-current 类
  parent.find(".search-group").removeClass("s-current");
  // 为与当前分类标签关联的 .search-group 元素添加 s-current 类
  parent
    .find("#" + $(this).attr("for"))
    .parents(".search-group")
    .addClass("s-current");
  // 调用 toTarget 函数处理目标元素的滚动
  toTarget($(this).parents(".s-type-list"), false, false);

  /*  // 将当前分类标签的 data-id 属性值存储到 localStorage 中的 searchlistmenu 键中(即将选择的分类缓存到本地)
        （个人更喜欢不记住上次选择，所以这里注释掉）
         window.localStorage.setItem("searchlistmenu", $(this).data("id")); */
});

//为搜索控件中的底部标签绑定点击事件，点击输入框时设置输入框属性并聚焦到输入框
//这里选择的虽然是input，但只是用来方便获取属性值，实际前端显示的是input旁边的label内容
$(".hide-type-list .search-group input").on("click", function () {
  //找到当前输入框的祖先元素.s-search
  var parent = $(this).parents(".s-search");
  //将祖先元素中的.super-search-fm表单的action属性值设置为当前输入框的action属性值。
  parent.children(".super-search-fm").attr("action", $(this).val());
  //将.search-key输入框的placeholder属性值设置为当前输入框的data-placeholder属性值。
  parent.find(".search-key").attr("placeholder", $(this).data("placeholder"));

  /* //如果当前输入框的ID是type-zhannei或m_type-zhannei，则将.search-key输入框的zhannei属性设置为true，否则设置为空字符串
  if (
    $(this).attr("id") == "type-zhannei" ||
    $(this).attr("id") == "m_type-zhannei"
  ) {
    parent.find(".search-key").attr("zhannei", "true");
  } else {
    parent.find(".search-key").attr("zhannei", "");
  } */

  /* // 将当前标签的ID去掉前缀m_后存储到localStorage中的searchlist键中(即将选择的标签缓存到本地)
        （个人更喜欢不记住上次选择，所以这里注释掉）
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_", ""));  */

  //选择并聚焦.search-key输入框
  parent.find(".search-key").select();
  parent.find(".search-key").focus();

  /* 如果当前匹配的input的value值为javascript:local-search，
    启用本地搜索，否则禁用 */
  enableLocalSearch = $(this).val() === "javascript:local-search";
  //获取搜索框的按钮元素，当使用本地搜索时禁用它
  let $searchButton = parent.children(".super-search-fm").find('button[type="submit"]');
  if (enableLocalSearch) {
    $searchButton.attr("disabled", true);
    $searchButton.css("cursor", "default");
  } else {
    $searchButton.attr("disabled", false);
    $searchButton.css("cursor", "");
  }

});
$(document).on("submit", ".super-search-fm", function () {
  var key = encodeURIComponent($(this).find(".search-key").val());
  if (key == "") return false;
  else {
    window.open($(this).attr("action") + key);
    return false;
  }
});

function getSmartTipsGoogle(value, parents) {
  $.ajax({
    type: "GET",
    url:
      "//suggestqueries.google.com/complete/search?client=firefox&callback=iowenHot",
    async: true,
    data: {
      q: value
    },
    dataType: "jsonp",
    jsonp: "callback",
    success: function (res) {
      var list = parents.children(".search-smart-tips");
      list.children("ul").text("");
      tipsList = res[1].length;
      if (tipsList) {
        for (var i = 0; i < tipsList; i++) {
          list.children("ul").append("<li>" + res[1][i] + "</li>");
          list.find("li").eq(i).click(function () {
            var keyword = $(this).html();
            parents.find(".smart-tips.search-key").val(keyword);
            parents.children(".super-search-fm").submit();
            list.slideUp(200);
          });
        }
        list.slideDown(200);
      } else {
        list.slideUp(200);
      }
    },
    error: function (res) {
      tipsList = 0;
    }
  });
}

function getSmartTipsBaidu(value, parents) {
  $.ajax({
    type: "GET",
    url: "//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?",
    async: true,
    data: {
      wd: value
    },
    dataType: "jsonp",
    jsonp: "cb",
    success: function (res) {
      var list = parents.children(".search-smart-tips");
      list.children("ul").text("");
      tipsList = res.s.length; //获取百度搜索提示词数量
      if (tipsList) {
        for (var i = 0; i < tipsList; i++) {
          list.children("ul").append("<li>" + res.s[i] + "</li>");
          list.find("li").eq(i).click(function () {
            var keyword = $(this).html();
            parents.find(".smart-tips.search-key").val(keyword);
            parents.children(".super-search-fm").submit();
            list.slideUp(200);
          });
        }
        list.slideDown(200);
      } else {
        list.slideUp(200);
      }
    },
    error: function (res) {
      tipsList = 0;
    }
  });
}

var listIndex = -1; //选中列索引
var tipsList = 0; //列表中总列数

/** 监听输入框事件，用于从百度和谷歌获取智能提示*/
// 绑定 blur 事件到 .smart-tips.search-key 元素；输入框失去焦点时隐藏提示词列表
$(document).on("blur", ".smart-tips.search-key", function () {
  // 延迟 150 毫秒后，将 .search-smart-tips 元素向上滑动 200 毫秒
  $(".search-smart-tips").delay(150).slideUp(200);
});

// 绑定 focus 事件到 .smart-tips.search-key 元素；输入框获取焦点时，查询并显示提示词列表
$(document).on("focus", ".smart-tips.search-key", function () {
  /* // 获取元素的 zhannei 属性值，并判断其是否存在且不为空字符串
  const isZhannei = $(this).attr("zhannei") !== ""; */

  // 找到当前元素的父元素 #search 并赋值给 parent 变量
  let parent = $(this).parents("#search");
  // 检查输入框已有字符长度
  if (encodeURIComponent($(this).val()).length === 1) {
    // 重置结果列表
    let resultList = parent.children(".search-smart-tips").children("ul");
    resultList.text("");
    resultList.append("<span><strong>提示：</strong>至少输入2个字母、数字或1个汉字</span>");
    parent.children(".search-smart-tips").slideDown(200);
    return;
  }

  
  // 如果当前搜索框的值不为空
  if ($(this).val()) {
    enableLocalSearch = $(this).parents(".super-search-fm").attr("action") === "javascript:local-search"; //获取当前是否是本地搜索框
    if (enableLocalSearch) {
      getLocalSearch(parent); //使用本地搜索
    } else {
      switch (theme.hotWords) {
        case "baidu":
          // 调用 getSmartTipsBaidu 方法获取百度的智能提示
          getSmartTipsBaidu($(this).val(), parent);
          break;
        case "google":
          // 调用 getSmartTipsGoogle 方法获取谷歌的智能提示
          getSmartTipsGoogle($(this).val(), parent);
          break;
        default:
          // 默认情况下不做任何操作
          break;
      }
    }
    // 将 listIndex 初始化为 -1
    listIndex = -1;
  }
  
});

// 绑定 keyup 事件到 .smart-tips.search-key 元素；输入框有按键事件时，查询并显示提示词。
$(document).on("keyup", ".smart-tips.search-key", function (e) {
  /* // 获取元素的 zhannei 属性值，并判断其是否存在且不为空字符串
  const isZhannei = $(this).attr("zhannei") !== ""; */
  // 找到当前元素的父元素 #search 并赋值给 parent 变量
  let parent = $(this).parents("#search");

  // 检查输入框已有字符长度
  if (encodeURIComponent($(this).val()).length === 1) {
    // 重置结果列表
    let resultList = parent.children(".search-smart-tips").children("ul");
    resultList.text("");
    resultList.append("<span><strong>提示：</strong>至少输入2个字母、数字或1个汉字</span>");
    parent.children(".search-smart-tips").slideDown(200);
    return;
  }
  // 如果当前搜索框的值不为空
  if ($(this).val()) {
    // 如果按键是上箭头键（38）或下箭头键（40），则返回，不执行后续逻辑
    if (e.keyCode === 38 || e.keyCode === 40) {
      return;
    }
    enableLocalSearch = $(this).parents(".super-search-fm").attr("action") === "javascript:local-search"; //获取当前是否是本地搜索框
    if (enableLocalSearch) {
      getLocalSearch(parent); //启用本地搜索
    } else {
      switch (theme.hotWords) {
        case "baidu":
          // 调用 getSmartTipsBaidu 方法获取百度的智能提示
          getSmartTipsBaidu($(this).val(), parent);
          break;
        case "google":
          // 调用 getSmartTipsGoogle 方法获取谷歌的智能提示
          getSmartTipsGoogle($(this).val(), parent);
          break;
        default:
          // 默认情况下不做任何操作
          break;
      }
    }
    // 将 listIndex 初始化为 -1
    listIndex = -1;
  } else {
    // 如果当前元素的值为空，则将 .search-smart-tips 元素向上滑动 200 毫秒(隐藏列表动画)
    $(".search-smart-tips").slideUp(200);
  }
});


// 绑定 keydown 事件到 .smart-tips.search-key 元素(即输入框有按键操作时触发)
$(document).on("keydown", ".smart-tips.search-key", function (e) {

  // 找到当前元素的父元素 #search 并赋值给 parent 变量
  let parent = $(this).parents("#search");
  let $itemUl = parent.find(".search-smart-tips ul");
  let $itemLi = $itemUl.children("li");
  // 如果按下的是下箭头键（40）
  if (e.keyCode === 40) {
    // 更新 listIndex，如果已经达到最大索引则重置为 0，否则加 1
    listIndex = listIndex === tipsList - 1 ? 0 : listIndex + 1;
    // 设置当前选中的列表项为 current 类，并移除其他兄弟元素的 current 类
    var $item = $itemLi.eq(listIndex);
    $item.addClass("current").siblings().removeClass("current");
    //滚动条滚动到选定项位置
    const topOffset = resultSingleLiHeight * listIndex; // 新选中项距离ul顶部的距离
    const bottomOffset = topOffset + resultSingleLiHeight; // 新选中项底部距离ul顶部的距离
    const scrollTop = $itemUl.scrollTop(); // 当前滚动条的位置
    const scrollBottom = scrollTop + resultUlHeight; // 当前滚动条底部位置
    if (topOffset < scrollTop || bottomOffset > scrollBottom) {// 如果新选中项不在可视区域内，则调整滚动条
      $itemUl.get(0).scrollTo({
        top: topOffset,
        behavior: 'auto' // 平滑滚动
      });
    }

    //如果未启用本地搜索，则将选中项文本填入搜索框中
    if (!enableLocalSearch) {
      // 获取当前选中的列表项的文本内容
      const hotValue = $item.html();
      // 将当前选中的列表项的文本内容设置为输入框的值
      parent.find(".smart-tips.search-key").val(hotValue);
    }
  }
  // 如果按下的是上箭头键（38）
  if (e.keyCode === 38) {
    // 阻止默认行为
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.returnValue) {
      e.returnValue = false;
    }
    // 更新 listIndex，如果已经是第一个索引则设置为最后一个索引，否则减 1
    listIndex =
      listIndex === 0 || listIndex === -1 ? listIndex = (tipsList - 1) : listIndex - 1;
    // 设置当前选中的列表项为 current 类，并移除其他兄弟元素的 current 类
    var $item = $itemLi.eq(listIndex);
    $item.addClass("current").siblings().removeClass("current");
    //滚动条滚动到选定项位置
    const topOffset = resultSingleLiHeight * listIndex; // 新选中项距离ul顶部的距离
    const bottomOffset = topOffset + resultSingleLiHeight; // 新选中项底部距离ul顶部的距离
    const scrollTop = $itemUl.scrollTop(); // 当前滚动条的位置
    const scrollBottom = scrollTop + resultUlHeight; // 当前滚动条底部位置
    if (topOffset < scrollTop || bottomOffset > scrollBottom) {// 如果新选中项不在可视区域内，则调整滚动条
      $itemUl.get(0).scrollTo({
        top: topOffset,
        behavior: 'smooth' // 平滑滚动
      });
    }
    //如果未启用本地搜索，则将选中项文本填入搜索框中
    if (!enableLocalSearch) {
      // 获取当前选中的列表项的文本内容
      const hotValue = $item.html();
      // 将当前选中的列表项的文本内容设置为输入框的值
      parent.find(".smart-tips.search-key").val(hotValue);
    }
  }
  // 如果按下回车键
  if (e.keyCode === 13) {
    if (enableLocalSearch) {
      e.preventDefault(); // 阻止默认行为
      // 如果当前有选中的项，就触发该项的链接的点击事件
      if (listIndex != -1) {
        var link = parent
          .find(".search-smart-tips ul li")
          .eq(listIndex)
          .children("a")[0];
        link.click();
      }
    }
  }
});


