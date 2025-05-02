function muyu_click() {
    //计数
    count = $("#count")
    num = parseInt(count.html()) + 1
    count.html(num)
    localStorage.setItem('muyu-count', num)
    $("#muyu svg").css("transform", "scale3d(0.93,0.93,0.93)")
    setTimeout(function () {
            $("#muyu svg").css("transform", "scale3d(1,1,1)")
        }, 100

    )
    //添加动画
    var tipId = num + "-tip";
    var $newTip = $("<div class='tip' id='" + tipId + "' style='z-index:" + num + "'>功德 +1</div>");
    $newTip.addClass("tip-effect"); // 使用预定义的 CSS 类设置样式
    $(".tips").prepend($newTip);
    setTimeout(function () {
        $("#" + tipId).fadeOut(300, function () {
            $(this).remove(); // 移除指定的 tip
        });
    }, 1500);
    //添加音效
    musicurl = $("#music").attr("data");
    music = $("<audio src='" + musicurl + "' class='musics'>")
    $("#music").prepend(music)
    music[0].play();
    setTimeout(function () {
        musics = document.getElementsByClassName("musics");
        musics[musics.length - 1].remove()
    }, 900)


}
autoInterval = ""

function auto() {
    autoInterval = setInterval(function () {
        muyu_click()
    }, 1000)
}

function reset() {
    localStorage.setItem('muyu-count', 0)
    $("#count").html(localStorage.getItem('muyu-count'))
}
$(document).ready(function () {
    console.log("\n %c Wooden-Fish https://github.com/IvanHanloth/wooden-fish", "font-weight:bold;color:#fff;background:linear-gradient(90deg,#44e9ff,#ffce60);padding:5px 0;font-family:'AliShuhei'");
    if (localStorage.getItem('muyu-count') == null) {
        localStorage.setItem('muyu-count', 0)
    }
    $("#count").html(localStorage.getItem('muyu-count'))
    $(".wooden-fish").on('click', function () {
        muyu_click()
    })
    $('.bottom input').on('change', function () {
        if ($('.bottom input').prop('checked')) {
            localStorage.setItem('muyu-auto', true)
            auto()
        } else {
            localStorage.setItem('muyu-auto', false)
            clearInterval(autoInterval)
        }
    })
})