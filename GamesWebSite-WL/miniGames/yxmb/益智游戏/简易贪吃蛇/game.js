$(document).ready(function() {
            // 游戏配置
            const boardSize = 500;
            const cellSize = 15;
            const gridSize = boardSize / cellSize;

            // 游戏状态
            let snake = [];
            let food = {};
            let direction = 'right';
            let gameLoop;
            let score = 0;
            let highScore = localStorage.getItem('highScore') || 0;
            let isGameRunning = false;

            // 添加暂停状态变量
            let isPaused = false;
            let savedInterval = null;

            // 显示最高分
            $('#highScore').text(highScore);

            // 初始化蛇的位置
            function initSnake() {
                snake = [
                    {x: 6, y: 10},
                    {x: 5, y: 10},
                    {x: 4, y: 10}
                ];
            }

            // 生成食物
            function generateFood() {
                while (true) {
                    food = {
                        x: Math.floor(Math.random() * gridSize),
                        y: Math.floor(Math.random() * gridSize)
                    };

                    // 确保食物不会生成在蛇身上
                    let foodOnSnake = false;
                    for (let body of snake) {
                        if (body.x === food.x && body.y === food.y) {
                            foodOnSnake = true;
                            break;
                        }
                    }
                    if (!foodOnSnake) break;
                }
            }

            // 绘制游戏画面
            function draw() {
                $('#gameBoard').empty();

                // 绘制蛇
                snake.forEach((segment, index) => {
                    const snakeElement = $('<div>')
                        .addClass('snake-body')
                        .css({
                            left: segment.x * cellSize + 'px',
                            top: segment.y * cellSize + 'px'
                        });

                    if (index === 0) {
                        snakeElement.addClass('head');
                    }

                    $('#gameBoard').append(snakeElement);
                });

                // 绘制食物
                $('#gameBoard').append(
                    $('<div>')
                        .addClass('food')
                        .css({
                            left: food.x * cellSize + 'px',
                            top: food.y * cellSize + 'px'
                        })
                );
            }

            // 移动蛇
            function moveSnake() {
                const head = {x: snake[0].x, y: snake[0].y};

                switch(direction) {
                    case 'up': head.y--; break;
                    case 'down': head.y++; break;
                    case 'left': head.x--; break;
                    case 'right': head.x++; break;
                }

                // 检查是否撞墙
                if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
                    gameOver();
                    return;
                }

                // 检查是否撞到自己
                for (let body of snake) {
                    if (head.x === body.x && head.y === body.y) {
                        gameOver();
                        return;
                    }
                }

                snake.unshift(head);

                // 检查是否吃到食物
                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    $('#score').text(score);
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('highScore', highScore);
                        $('#highScore').text(highScore);
                    }
                    generateFood();
                } else {
                    snake.pop();
                }

                draw();
            }

            // 游戏结束
            function gameOver() {
                clearInterval(gameLoop);
                alert('游戏结束！得分：' + score);
                isGameRunning = false;
                isPaused = false;
                $('#startBtn').text('重新开始');
                $('.pause-text').remove();
            }

            // 开始游戏
            function startGame() {
                if (isGameRunning) return;

                isGameRunning = true;
                isPaused = false;
                score = 0;
                $('#score').text(score);
                direction = 'right';
                $('#startBtn').text('游戏中...');

                initSnake();
                generateFood();
                draw();

                if (gameLoop) clearInterval(gameLoop);
                gameLoop = setInterval(moveSnake, 150);
            }

            // 添加暂停函数
            function togglePause() {
                if (!isGameRunning) return;

                if (isPaused) {
                    // 继续游戏
                    isPaused = false;
                    gameLoop = setInterval(moveSnake, 150);
                    $('#startBtn').text('游戏中...');
                    // 移除暂停提示
                    $('.pause-text').remove();
                } else {
                    // 暂停游戏
                    isPaused = true;
                    clearInterval(gameLoop);
                    $('#startBtn').text('已暂停');
                    // 添加暂停提示
                    $('#gameBoard').append(
                        $('<div>')
                            .addClass('pause-text')
                            .text('游戏暂停')
                    );
                }
            }

            // 键盘控制
            $(document).keydown(function(e) {
                // 防止方向键和空格键滚动页面
                if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }

                // 空格键控制暂停
                if (e.keyCode === 32) { // 空格键
                    togglePause();
                    return;
                }

                // 游戏暂停时不响应方向键
                if (!isGameRunning || isPaused) return;

                switch(e.keyCode) {
                    case 38: // 上
                        if (direction !== 'down') direction = 'up';
                        break;
                    case 40: // 下
                        if (direction !== 'up') direction = 'down';
                        break;
                    case 37: // 左
                        if (direction !== 'right') direction = 'left';
                        break;
                    case 39: // 右
                        if (direction !== 'left') direction = 'right';
                        break;
                }
            });

            // 绑定开始按钮事件
            $('#startBtn').click(startGame);
        });