//下载存档
function saveFileDownload() {
    const keys = ['neverball'];

    const mergedData = {};

    keys.forEach(key => {
        const data = localStorage.getItem(key);

        if (data) {
            try {
                const jsonData = JSON.parse(data);
                mergedData[key] = jsonData;
            } catch (e) {
                console.error(`解析存档数据时出错 ${key}:`, e);
                mergedData[key] = data;
                return;
            }
        } else {
            console.warn(`在localStorage中存档数据对应的key: ${key}`);
        }
    });

    const blob = new Blob([JSON.stringify(mergedData, null, 2)], {
        type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'neverball_save_levels.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
}


//触发上传存档按钮
function saveFileUpload() {
    document.getElementById('saveUploadInput').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadJsonFile(file);
    }
    event.target.value = '';
    history.go(0);
}
//上传存档
function uploadJsonFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        let jsonData;

        try {
            jsonData = JSON.parse(contents);
        } catch (e) {
            console.error("解析上传的存档时出错:", e);
            alert("上传的存档格式不正确，请上传有效的JSON文件。");
            return;
        }

        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                localStorage.setItem(key, JSON.stringify(jsonData[key]));
            }
        }

        alert("存档上传成功！");
    };

    reader.readAsText(file);
}