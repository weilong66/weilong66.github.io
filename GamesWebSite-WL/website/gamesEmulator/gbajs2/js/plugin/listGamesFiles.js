/* document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fetchGamesFiles').addEventListener('click', fetchGamesFiles());
}); */

//页面加载完成后，动态添加“加载游戏”按钮。
//（目的是为了避免出现版权问题，这样只有知道特定请求参数才能看到内置的游戏ROM）
document.addEventListener('DOMContentLoaded', function () {
    // 获取查询参数
    const params = getQueryParams();
    // 如果查询参数中包含tag且值为gamelist 或 gamelist参数存在，则动态添加“加载游戏”按钮
    if (params.tag === 'gamelist' || 'gamelist' in params) {
        // 创建button元素
        var button = document.createElement('button');
        // 设置button的id属性
        button.id = 'fetchGamesFiles';
        // 设置button的文本内容
        button.textContent = '加载游戏';
        // 为button添加onclick事件处理函数
        button.onclick = fetchGamesFilesList;
        // 获取目标div
        var div = document.getElementById('preload');
        // 将button添加到div中
        div.appendChild(button);
    }
});


function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1); // 去掉开头的 '?'
    const pairs = queryString.split('&');

    for (let pair of pairs) {
        let [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }

    return params;
}



// 定义一个函数，用于加载文件列表
function fetchGamesFilesList() {
    const floatingListContainer = document.getElementById('floatingListContainer');
    // 添加关闭按钮的点击事件
    document.getElementById('closeButton').addEventListener('click', function () {
        floatingListContainer.style.display = 'none';
    });
    // 使用fetch函数获取fileList.json文件
    fetch('roms/gba/gameList.json') // 确保路径正确指向你的JSON文件
        .then(response => response.json())
        .then(data => {
            const gameList = document.getElementById('gameList');

            // 清空之前的列表项
            gameList.innerHTML = '';

            // 循环遍历，构建每个元素
            data.gba.forEach(function (file) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = file.name;
                a.onclick = function (event) {
                    event.preventDefault();
                    floatingListContainer.style.display = 'none'; // 隐藏浮窗
                    handleFileSelection(file);
                };
                li.appendChild(a);
                gameList.appendChild(li);
            });

            // 如果索引不是0且是5的倍数，则添加一个换行符（实际上是新的flex容器特性）
            /* if ((index + 1) % 5 === 0 && index < data.gba.length - 1) {
                const br = document.createElement('div');
                br.className = 'flex-break'; // 使用一个div作为换行标记
                gameList.appendChild(br);
            } */

            // 显示浮窗
            floatingListContainer.style.display = 'block';
        })
        // 如果fetch函数出错，则输出错误信息
        .catch(error => console.error('Error fetching the file list:', error));
}

//定义一个函数用于在下载游戏列表中的游戏文件时显示提示
function showMessageToFloatingList(message, notClear, idName) {
    const floatingListContainer = document.getElementById('floatingListContainer');
    if (!message) {
        message = "";
    }
    const gameList = document.getElementById('gameList');
    const li = document.createElement('li');
    if (!notClear) {
        // 清空之前的所有列表项
        gameList.innerHTML = '';
        li.innerHTML = message;
        if (idName) {
            li.id = idName;
        }
        gameList.appendChild(li);
    } else if (notClear) {
        if (idName) {
            //更新指定id列表项
            if (document.getElementById(idName)) {
                document.getElementById(idName).innerHTML = message;
            } else {
                li.innerHTML = message;
                li.id = idName;
            }
        } else {
            li.innerHTML = message;
        }
        gameList.appendChild(li);
    }
    // 显示浮窗
    floatingListContainer.style.display = 'block';
}

function hideMessageToFloatingList() {
    const floatingListContainer = document.getElementById('floatingListContainer');
    floatingListContainer.style.display = 'none';
}

let holdCount = 0;
// 从服务器请求下载文件
function downloadServerFile(url, callback, prefixMessage, messageId) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob'; // 设置响应类型为blob以便处理二进制数据

    //增加持有计数
    holdCount++;

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`${prefixMessage} ${percentComplete.toFixed(2)}%`);
            showMessageToFloatingList(prefixMessage + "<span style='color:red;'>" + percentComplete.toFixed(2) + " %</span>", messageId ? true : false, messageId);
            // 可以在这里更新UI，显示下载进度
        }
    };
    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            callback(blob);
        } else {
            console.error('下载失败，请尝试使用自己的ROM文件:', xhr.statusText);
        }
        holdCount--;
        if (holdCount == 0) {
            hideMessageToFloatingList();
            setLoadState(false);
        }
    };
    xhr.onerror = function () {
        console.error('请求过程中遇到错误');
        holdCount--;
        if (holdCount == 0) {
            hideMessageToFloatingList();
            setLoadState(false);
        }
    };
    xhr.send();
}

/**
 * 处理文件选择事件的函数。
 * 当用户在游戏列表中选择一个游戏文件时，此函数将被调用。
 * 它会根据游戏文件的路径信息，尝试加载游戏ROM文件和存档文件（如果存在）。
 * 
 * @param {Object} gameFile - 包含游戏文件信息的JSON对象，应包含`name`、`gamePath` 和`savePath` 属性。
 * @param {string} gameFile.name - 游戏名称。
 * @param {string} gameFile.gamePath - 游戏ROM文件的路径。
 * @param {string} [gameFile.savePath] - 游戏存档文件的路径（可选）。
 */
async function handleFileSelection(gameFile) {
    // 检查游戏文件路径是否存在
    if (gameFile.gamePath) {
        setLoadState(true);
        showMessageToFloatingList("将从服务器下载游戏ROM，请稍候...<br/>（下载完成后此窗口将自动关闭并加载游戏）<br/>（如果长时间未能成功下载，请改为自行上传ROM文件）<br/>")
        showMessageToFloatingList("<br/>", true)
        // 检查游戏存档文件路径是否存在
        if (gameFile.savePath) {
            console.log('所选游戏ROM存在存档文件，将从服务器下载存档文件...');
            downloadServerFile(gameFile.savePath, uploadSavedataPending, "正在从服务器下载存档：", "gameSaveDownloadMessage");
        }
        console.log('开始从服务器下载游戏ROM...');
        downloadServerFile(gameFile.gamePath, run, "正在从服务器下载游戏ROM：", "gameFileDownloadMessage");
    }


}

/* //旧的处理文件选择事件的函数。因为不能显示下载进度，所以弃用。
 function handleFileSelection(gameFile) {
    // 检查游戏文件路径是否存在
    if (gameFile.gamePath) {
        setLoadState(true);
        // 检查游戏存档文件路径是否存在
        if (gameFile.savePath) {
            console.log('所选游戏ROM存在存档文件，正在上传存档文件...');
            // 使用fetch API获取游戏存档文件
            fetch(gameFile.savePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常：' + response.statusText);
                    }
                    return response.blob(); // 如果是文本文件。如果是JSON文件，可以使用response.json()
                })
                .then(data => {
                    // 将文件内容传递给processFileContent函数
                    uploadSavedataPending(data);
                })
                .catch(error => {
                    console.error('ROM读取失败，请尝试使用自己的ROM文件:', error);
                });
        }

        showMessageToFloatingList("正在从服务器下载游戏ROM，请稍候...<br/>（下载完成后此窗口将自动关闭并加载游戏）<br/>（如果长时间未能成功下载，请改为自行上传ROM文件）");
        // // 模拟延迟 2000 毫秒（2 秒）
        // await delay(2000);
        hideMessageToFloatingList();
        console.log('正在加载游戏“ ' + gameFile.name + ' ”的ROM文件...');
        // 使用fetch API获取游戏ROM文件
        fetch(gameFile.gamePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常：' + response.statusText);
                }
                return response.blob(); // 如果是文本文件。如果是JSON文件，可以使用response.json()
            })
            .then(data => {
                console.log('游戏“ ' + gameFile.name + ' ”加载完成');
                // 将文件内容传递给processFileContent函数
                run(data);
            })
            .catch(error => {
                console.error('ROM读取失败，请尝试使用自己的ROM文件:', error);
            });
    }
} */

//设置游戏存档加载状态
function setLoadState(enable) {
    $('#select').first().prop('disabled', enable);
    $('#fetchGamesFiles').first().prop('disabled', enable);
    $('#loader-button').first().prop('disabled', enable);
};