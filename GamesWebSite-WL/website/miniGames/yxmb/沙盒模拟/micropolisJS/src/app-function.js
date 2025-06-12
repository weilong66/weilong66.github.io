//工具箱-下载按钮
document.getElementById("downloadRequest").addEventListener("click", function () {
    document.getElementById("downloadWindow").style.display = "block";
    document.getElementById("opaque").style.display = "block";
    const pauseRequest = document.getElementById("pauseRequest");
    if (pauseRequest.innerText === "暂停") {
        pauseRequest.click();
    }
    downloadMicropolisJSGameData();
})

//下载弹窗-下载按钮
document.querySelectorAll(".btn-download-drchive").forEach(function(button) {
    button.addEventListener("click", function() {
        downloadMicropolisJSGameData();
    });
});

//下载弹窗-OK按钮
document.getElementById("downloadOK").addEventListener("click", function () {
    document.getElementById("downloadWindow").style.display = "";
    document.getElementById("opaque").style.display = "";
    const pauseRequest = document.getElementById("pauseRequest");
    if (pauseRequest.innerText === "继续") {
        pauseRequest.click();
    }
})

//上传按钮
document.getElementById("splashUploadSave").addEventListener("click", function () {
    console.log("上传存档")
    uploadMicropolisJSGameData();
})

//从localStorage下载存档
function downloadMicropolisJSGameData() {
    const data = localStorage.getItem('micropolisJSGame');
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'micropolisJSGame_data.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url); // 释放之前创建的URL对象
    } else {
        alert('没有找到micropolisJSGame数据。');
    }
}

//上传存档到localStorage
function uploadMicropolisJSGameData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // 只接受JSON文件

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result; // 文件内容字符串
            try {
                // 尝试解析为JSON对象，确保数据格式正确
                JSON.parse(content);
                localStorage.setItem('micropolisJSGame', content);
                alert('存档已成功上传！');
                window.location.reload();
            } catch (e) {
                alert('上传失败：文件不是有效的JSON格式。');
            }
        };
        reader.readAsText(file);
    };

    input.click(); // 触发文件选择对话框
}