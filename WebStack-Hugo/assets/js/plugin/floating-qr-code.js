var qrcodeEle = document.getElementById("qrcode-fancybox");
var qrcodeTitle = document.getElementById('qrcode-title');
var qrcodeLogo = document.getElementById('qrcode-logo');

// 二维码信息
const qrcodeWidth = 400; // 二维码宽
const qrcodeHeight = 400; // 二维码高
const qrcodeShowWidth = 200; // 二维码显示宽度(需要与样式一致)

// 创建二维码对象
var qrcode = new QRCode(qrcodeEle, {
    text: window.location.href,
    width: qrcodeWidth,
    height: qrcodeHeight,
    colorDark: "#000000", // 二维码前景色
    colorLight: "#ffffff", // 二维码背景色
    // correctLevel: QRCode.CorrectLevel.H // 二维码纠错等级
});

// 创建二维码Logo图片对象
var qrcodeLogoImg = document.getElementById('qrcode-logo-img');
if (!qrcodeLogoImg) {
    qrcodeLogoImg = document.createElement('img');
}
qrcodeLogoImg.alt = 'Logo';
qrcodeLogoImg.id = 'qrcode-logo-img'
qrcodeLogoImg.width = qrcodeShowWidth * 0.2;
qrcodeLogoImg.height = qrcodeShowWidth * 0.2;


/**
 * 生成二维码
 * @param {*} text 二维码内容
 * @param {*} title [二维码标题]
 * @param {*} logoPath [二维码logo]
 */
function makeCode(text, title, logoPath) {
    if (text) {
        // 生成二维码。
        qrcode.makeCode(text);
    } else {
        console.warn("二维码内容参数不能为空,makeCode()方法调用失败");
        return false;
    }

    if (title) {
        // 设置二维码标题
        qrcodeTitle.innerText = title;
    } else {
        qrcodeTitle.innerText = '';
    }

    if (logoPath) {
        //创建img元素添加到二维码logo容器中
        qrcodeLogo.appendChild(qrcodeLogoImg);
        // 设置二维码logo路径
        qrcodeLogoImg.src = logoPath;
    } else {
        qrcodeLogo.innerHTML = '';
    }

    var imgElement = qrcodeEle.getElementsByTagName('img')[0];
    if (imgElement) {
        // 将 img 元素的 src 值赋给 qrcodeEle 的 href 属性
        qrcodeEle.href = imgElement.src;
    }
}

/**
 * 切换二维码小部件
 */
function switchQrcodeWidget() {
    // 检查元素是否隐藏
    if ($('#floating-qrcode').is(':hidden')) {
        // 如果隐藏，则显示元素
        $('#floating-qrcode').show();
        $("#qr-code").attr("data-original-title", "关闭二维码");
        // 重新生成二维码
        makeCode(window.location.href, 'WL网址导航');

    } else {
        // 如果显示，则隐藏元素
        $('#floating-qrcode').hide();
        $("#qr-code").attr("data-original-title", "获取二维码");
    }
}



/**
 * 以下添加拖放生成二维码功能
 */

// 显示拖放区域
function showDropArea() {
    const dropArea = document.getElementById('drop-area');
    dropArea.style.visibility = 'visible';
    dropArea.style.opacity = '1';
}
// 隐藏拖放区域
function hideDropArea() {
    const dropArea = document.getElementById('drop-area');
    dropArea.style.visibility = 'hidden';
    dropArea.style.opacity = '0';
}
// 处理拖拽事件
function handleDragOver(event) {
    // 阻止默认行为
    event.preventDefault();
    // 获取拖拽区域元素
    const dropArea = document.getElementById('drop-area');
    // 添加拖拽样式
    dropArea.classList.add('drag-over');
}
// 隐藏拖放区域(处理拖拽离开事件)
function handleDragLeave(event) {
    // 获取拖拽区域元素
    const dropArea = document.getElementById('drop-area');
    // 移除拖拽区域元素的拖拽样式
    dropArea.classList.remove('drag-over');
}
// 处理拖放事件
function handleDrop(event) {
    // 阻止默认行为
    event.preventDefault();
    // 获取拖放区域元素
    const dropArea = document.getElementById('drop-area');
    // 移除拖放区域元素的拖放样式
    dropArea.classList.remove('drag-over');
    // 隐藏拖放区域
    hideDropArea();

    // 获取拖放的数据
    const linkElement = event.dataTransfer.getData("text/html");
    // 创建DOM解析器
    const parser = new DOMParser();
    // 解析拖放的数据
    const doc = parser.parseFromString(linkElement, "text/html");
    // 获取拖放的数据中的链接元素
    const anchorTag = doc.querySelector('a');

    // 如果链接元素存在且有href属性
    if (anchorTag && anchorTag.href) {
        // 获取链接元素下的标题文本
        const targetDiv = anchorTag.querySelector('div.text-sm.overflowClip_1');
        let textContent = '';
        const imgSrc = anchorTag.getElementsByTagName('img')[0].src;
        if (targetDiv && imgSrc) {
            textContent = targetDiv.textContent.trim(); // 或者使用 innerText: targetDiv.innerText.trim()
            makeCode(anchorTag.href, textContent, imgSrc); // 生成带标题和logo的二维码
        } else {
            // 重新生成二维码
            makeCode(anchorTag.href);
        }


    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 为所有导航页主区域下添加拖拽事件监听器
    document.querySelector('.content-site').addEventListener('dragstart', event => {
        const qrCodeDiv = document.getElementById('floating-qrcode'); // 获取二维码div元素
        const computedStyle = window.getComputedStyle(qrCodeDiv); // 获取二维码div元素的样式
        if (computedStyle && computedStyle.display !== 'none') { // 如果二维码div元素可见
            event.dataTransfer.setData("text/html", event.target.outerHTML); //当用户开始拖动链接时，将链接的HTML代码存储到拖放数据中
            showDropArea(); //调用showDropArea显示拖拽区域
        }
    });

    /* 为导航页主区域下所有<a> 元素添加拖拽事件监听器（似乎有性能问题，暂时弃用）
     document.querySelectorAll('.url-body a').forEach(link => {
        link.setAttribute('draggable', 'true'); // 将每个链接设置为可拖动
        //为每个链接添加dragstart事件监听器
        link.addEventListener('dragstart', event => {
            const qrCodeDiv = document.getElementById('floating-qrcode'); // 获取二维码div元素
            const computedStyle = window.getComputedStyle(qrCodeDiv); // 获取二维码div元素的样式
            if (computedStyle && computedStyle.display !== 'none') { // 如果二维码div元素可见
                event.dataTransfer.setData("text/html", event.target.outerHTML); //当用户开始拖动链接时，将链接的HTML代码存储到拖放数据中
                showDropArea(); //调用showDropArea显示拖拽区域
            }
        });
    }); */

    // 为拖拽结束添加事件监听器
    document.addEventListener('dragend', () => {
        const qrCodeDiv = document.getElementById('floating-qrcode'); // 获取二维码div元素
        const computedStyle = window.getComputedStyle(qrCodeDiv); // 获取二维码div元素的样式
        if (computedStyle && computedStyle.display !== 'none') { // 如果二维码div元素可见
            hideDropArea(); //调用hideDropArea隐藏拖拽区域
        }
    });
});