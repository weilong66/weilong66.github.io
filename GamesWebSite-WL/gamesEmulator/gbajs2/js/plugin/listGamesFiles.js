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
    // 添加关闭按钮的点击事件
    document.getElementById('closeButton').addEventListener('click', function () {
        document.getElementById('floatingListContainer').style.display = 'none';
    });
    // 使用fetch函数获取fileList.json文件
    fetch('roms/gba/gameList.json') // 确保路径正确指向你的JSON文件
        .then(response => response.json())
        .then(data => {
            const floatingListContainer = document.getElementById('floatingListContainer');
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
                    handleFileSelection(file);
                    floatingListContainer.style.display = 'none'; // 隐藏浮窗
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

function handleFileSelection(gameFile) {
    if (gameFile.gamePath) {
        if (gameFile.savePath) {
            console.log('存在存档文件，将会使用存档.');
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

        // 使用fetch API获取游戏ROM文件
        fetch(gameFile.gamePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常：' + response.statusText);
                }
                return response.blob(); // 如果是文本文件。如果是JSON文件，可以使用response.json()
            })
            .then(data => {
                // 将文件内容传递给processFileContent函数
                run(data);
            })
            .catch(error => {
                console.error('ROM读取失败，请尝试使用自己的ROM文件:', error);
            });

        /*  console.log('加载ROM: ' + gameFile.name + '； 路径：' + gameFile.gamePath);
         
         fs.readFile(gameFile.gamePath, 'utf8', (err, fileContent) => {
             if (err) {
                 console.error('ROM读取失败，请尝试使用自己的ROM文件:', err);
                 return;
             }
 
             // 调用run函数并传入文件内容
             run(fileContent);
         }); */

    }


}