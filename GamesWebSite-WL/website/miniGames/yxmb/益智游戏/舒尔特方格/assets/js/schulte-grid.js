var currentGrid = []; // 要用作舒尔特表的数字数组
var gridSize = 5; // 默认网格大小
var nextNumberToClick = 1; // 下一个要点击的数字
var startTime = null; // 开始时间
var timerInterval = null; // 定时器
var rightCount = 0; // 正确点击次数
var errorCount = 0; // 错误点击次数
var lastClickedCorrectCell = null; // 上一个正确点击的单元格

generateGrid(gridSize);

function generateGrid(size) {
    const container = document.getElementById('schulte-grid');
    container.innerHTML = ''; // 清空容器
    gridSize = size;
    nextNumberToClick = 1;

    currentGrid = Array.from({
        length: size * size
    }, (_, i) => i + 1);
    shuffleArray(currentGrid);

    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            cell.textContent = currentGrid[i * size + j];
            cell.addEventListener('click', () => handleItemClick(cell));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }

    resetTimer();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handleItemClick(cell) {
    // 获取“保持颜色”复选框的值
    const isHoldColor = document.getElementById("hold-color-checkbox").checked;
    if (parseInt(cell.textContent) === nextNumberToClick) {
        // 通过添加类名，为已正确点击方格设置颜色
        cell.classList.add('clicked');
        // 如果“保持颜色”复选框未选中,且已正确点击过方格，则1秒后移除上次正确点击方格的clicked类名(去除颜色)
        // if (!isHoldColor && lastClickedCorrectCell) {
        //      lastClickedCorrectCell.classList.remove("clicked");
        // }
        // 如果“保持颜色”复选框未选中,则1秒后移除上次正确点击方格的clicked类名(去除颜色)
        if (!isHoldColor) {
            setTimeout(() => {
                cell.classList.remove("clicked");
            }, 400);
        }
        nextNumberToClick++;
        setRightCount(rightCount + 1);
        lastClickedCorrectCell = cell;
        if (startTime === null) {
            startTimer();
            setStatusText('进行中', '#009688');
        }
        if (nextNumberToClick > gridSize * gridSize) {
            clearInterval(timerInterval);
            setStatusText('已结束', '#cf1212');
            document.getElementById('timer').style.color = '#cf1212';
        }
    } else {
        cell.classList.add('click-wrong');
        setTimeout(() => {
            cell.classList.remove("click-wrong");
        }, 300);
        if (nextNumberToClick == 1) {
            showMessage(`请按点击数字 1 以开始游戏。`);
        }else{
            setErrorCount(errorCount + 1);
            showMessage(`请按顺序点击数字 ${nextNumberToClick}`);
        }
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = (elapsedTime % 1000).toString().padStart(3, '0');
        document.getElementById('timer').textContent = `时间: ${hours}小时 ${minutes}分钟 ${seconds}秒 ${milliseconds}毫秒`;
    }, 1);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = "用时: 00小时 00分钟 00秒 000毫秒";
    document.getElementById('timer').style.color = 'black';
    startTime = null;
}

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function restartGame() {
    resetTimer();
    generateGrid(gridSize);
    setStatusText('未开始', '#000');
    setRightCount(0);
    setErrorCount(0);
}

function changeLevel(event) {
    const newGridSize = parseInt(event.target.value);
    if (newGridSize !== gridSize) {
        gridSize = newGridSize;
        restartGame();
    }
}

function changeLevelByButton(level) {
    document.getElementById('level-select').value = level;
    changeLevel({
        target: {
            value: level
        }
    });
}

function setRightCount(rightNumber) {
    rightCount = rightNumber;
    document.getElementById('right-count').textContent = rightCount;
    return rightCount;
};

function setErrorCount(errorNumber) {
    errorCount = errorNumber;
    document.getElementById('error-count').textContent = errorCount;
    return errorCount;
};


function setStatusText(statusText, color) {
    let statusTextEle = document.getElementById('status-text')
    statusTextEle.textContent = statusText;
    if (color) {
        statusTextEle.style.color = color;
    }
}

function generarAbout(htmlText) {
    let aboutBoxEle = document.getElementById('about-box')
    let aboutTextBoxEle = document.getElementById('about-text-box')
    if (aboutBoxEle.style.display === 'block') {
        aboutBoxEle.style.display = 'none';
    } else {
        if (!htmlText) {
            htmlText = "<h3 style='margin: 5px 0 5px 0;text-align: center;'>介绍</h3>" +
                "<ul><li>舒尔特方格（Schulte Grid）是一种用于测试注意力集中力和记忆力的游戏。</li></ul>"
        }
        aboutTextBoxEle.innerHTML = htmlText;
        aboutBoxEle.style.display = 'block';
    }
}

// 绑定重新开始按钮事件
document.getElementById('restart-button').addEventListener('click', restartGame);

// 绑定级别选择事件
document.getElementById('level-select').addEventListener('change', function (event) {
    changeLevel(event);
    let schulteTable = document.getElementById('schulte-grid');
    if (event.target.value > 6) {
        schulteTable.classList.add('table-small');
    } else {
        schulteTable.classList.remove('table-small');
    }
});

// 绑定关于按钮事件
document.getElementById('about').addEventListener('click', function () {
    const aboutHtml = "<h3 style='margin: 5px 0 5px 0;text-align: center;'>介绍</h3>" +
        "<ul><li>舒尔特方格（Schulte Grid）是一种用于测试注意力集中力和记忆力的游戏。</li>" +
        "<li>玩家需要按照数字顺序点击方格，依次点击数字1、2、3...直到最后一个数字。</li>" +
        "<li>平均1个字符用时 0.6 - 1 秒即为合格，例如以 [5x5] 为例，成年人的完成时间应在15秒以内，最大不超过25秒。</li>" +
        "<li>舒尔特方格不但可以简单测量注意力水平，而且是很好的训练方法，可以培养注意力集中、记忆力能力和反应速度；提高视觉的稳定性、辨别力、定向搜索能力。</li>" +
        "<li>练习的时间越长，看表所需的时间会越短。随着练习的深入，眼球的末梢视觉能力提高，可以有效地拓展视幅，加快阅读节奏，锻炼眼睛快速认读。</li>" +
        "<li>视野较宽、注意力参数较高的人，建议从 [5x5] 开始练习。如果有兴趣可继续提高练习的难度。</li>"+
        "</ul>";
    generarAbout(aboutHtml);
})