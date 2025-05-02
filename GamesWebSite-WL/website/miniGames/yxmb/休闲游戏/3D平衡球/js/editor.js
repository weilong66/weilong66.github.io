function LevelEditor(id) {
    var main = document.getElementById(id);
    var grid = main.getElementsByClassName('grid')[0];
    var w = 30,
        h = 30;
    var rows = 20;
    var cols = 20;
    var self = this;
    var tools = [];

    var NONE = 0;
    var COLOR_FILL = 1;
    var PICKER = 2;
    var COIN_FILL = 3;
    var DELETE = 4;
    var CUBE = 5;
    var NEVERBALL = 6;
    var GOAL = 7;

    var cursel = COLOR_FILL;

    var lmanager = new LevelManager();
    var svg;
    var svgw = 3 * w;
    var svgh = 3 * h;
    var line;

    var svgInit = function () {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', svgw);
        svg.setAttribute('height', svgh);
        svg.style.position = "absolute";
        svg.style.pointerEvents = "none";

        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', svgw / 2);
        line.setAttribute('y1', svgh / 2);
        line.setAttribute('x2', svgw / 2);
        line.setAttribute('y2', 0);
        line.setAttribute('stroke', "black");
        line.setAttribute('stroke-width', 2);
        svg.appendChild(line);
    }

    svgInit();

    var createColorFill = function () {
        var colorpicker;
        colorpicker = document.createElement('input');
        colorpicker.style.display = "block";
        colorpicker.type = "color";
        colorpicker.title = "地面工具，可以设置不同颜色。";
        colorpicker.onmousedown = function () {
            // 阻止默认行为
            event.preventDefault();
            cursel = COLOR_FILL;
        }
        return colorpicker;
    }

    var createPicker = function () {
        var obj = document.createElement('div');
        obj.className = "btn";
        obj.innerText = "拾色器";
        obj.title = "拾取某个地面颜色，拾取后自动切换到地面工具。";
        obj.onmousedown = function () {
            // 阻止默认行为
            event.preventDefault();
            cursel = PICKER;
        }
        return obj;

    }

    var createCube = function () {
        var obj = document.createElement('div');
        obj.className = "btn";
        obj.innerText = "墙";
        obj.onmousedown = function () {
            // 阻止默认行为
            event.preventDefault();
            cursel = CUBE;
        }
        return obj;
    }

    var createGoal = function () {
        var obj = document.createElement('div');
        obj.className = "btn";
        obj.innerText = "目标点";
        obj.title = "吃完金币后需要让平衡球滚到目标点才能完成游戏";
        obj.onmousedown = function () {
            // 阻止默认行为
            event.preventDefault();
            cursel = GOAL;
        }
        return obj;
    }

    var get = function (row, col) {
        var div = document.createElement('div');
        div.id = "cell" + row * cols + col;
        div.style.position = "absolute";
        div.style.width = w + "px";
        div.style.cursor = "pointer";
        div.style.height = h + "px";
        var border = "1px solid black";
        div.style.borderLeft = border;
        if (col == cols - 1) {
            div.style.borderRight = border;
        }
        div.style.borderTop = border;
        if (row == rows - 1) {
            div.style.borderBottom = border;
        }
        div.style.top = row * h + "px";
        div.style.left = col * w + "px";
        return div;
    }

    var addCoin = function (row, col) {
        var coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.width = w + "px";
        coin.style.height = h + "px";
        divs[row][col].appendChild(coin);
    }

    var addCube = function (row, col) {
        var cube = document.createElement('div');
        cube.className = 'cube';
        divs[row][col].appendChild(cube);
    }

    var neverball_info;
    var goal_info;

    var resetInfo = function () {
        neverball_info = {
            pos: {
                row: -1,
                col: -1
            },
            dir: {
                u: 0,
                v: 0
            },
            ball: null,
            mousedown: false
        };
        goal_info = {
            pos: {
                row: -1,
                col: -1
            },
            goal: null
        };
    }

    resetInfo();

    var down = 0;
    var downpos = {
        x: 0,
        y: 0
    };

    document.onmouseup = function () {
        neverball_info.mousedown = false;
        down = 0;
    }

    var setLine = function (u, v) {
        var r = Math.min(svgw / 2.0, svgh / 2.0);
        neverball_info.dir.u = u;
        neverball_info.dir.v = v;
        line.setAttribute('x2', svgw / 2 + r * u);
        line.setAttribute('y2', svgh / 2 + r * v);
    }

    document.onmousemove = function (e) {
        if (neverball_info.mousedown == false) return;
        var mx = e.clientX;
        var my = e.clientY;
        line.setAttribute('x1', svgw / 2);
        line.setAttribute('y1', svgh / 2);
        var u = mx - downpos.x;
        var v = my - downpos.y;
        var mg = Math.sqrt(u * u + v * v);
        if (mg == 0) {
            u = 0;
            v = -1;
            mg = 1;
        }
        u /= mg;
        v /= mg;
        setLine(u, v);
    }

    var addNeverball = function (row, col) {
        var prow = neverball_info.pos.row;
        var pcol = neverball_info.pos.col;
        if (prow == -1) {
            var obj = document.createElement('div');
            obj.className = 'neverball';
            neverball_info.ball = obj;
            setLine(0, -1);
            grid.appendChild(svg);
            neverball_info.ball.onmousedown = function (e) {
                // 阻止默认行为
                event.preventDefault();
                neverball_info.mousedown = true;
                downpos.x = e.clientX;
                downpos.y = e.clientY;
            }
        } else if (prow != row || pcol != col) {
            divs[prow][pcol].removeChild(neverball_info.ball);
        }
        neverball_info.pos.row = row;
        neverball_info.pos.col = col;
        var b = svg.getBBox();
        var x = col * w + w / 2 - svgw / 2;
        var y = row * h + h / 2 - svgh / 2;
        svg.style.left = x + "px";
        svg.style.top = y + "px";
        divs[row][col].appendChild(neverball_info.ball);
    }

    var addGoal = function (row, col) {
        var prow = goal_info.pos.row;
        var pcol = goal_info.pos.col;
        if (prow == -1) {
            var obj = document.createElement('img');
            obj.src = "images/goal.png";
            obj.className = 'goal';
            goal_info.goal = obj;
        } else if (prow != row || pcol != col) {
            divs[prow][pcol].removeChild(goal_info.goal);
        }
        goal_info.pos.row = row;
        goal_info.pos.col = col;
        divs[row][col].appendChild(goal_info.goal);
    }

    var divs = {};
    var map = {};
    var mouseEvent = function (row, col, move = false) {
        if (move) {
            if (neverball_info.mousedown == true) {
                return;
            }
        }
        switch (cursel) {
            case COLOR_FILL: {
                map[row][col]["color"] = tools[COLOR_FILL].value;
                divs[row][col].style.backgroundColor = tools[COLOR_FILL].value;
            }
            break;
        case PICKER: {
            if ("color" in map[row][col]) {
                tools[COLOR_FILL].value = map[row][col]["color"];
                cursel = COLOR_FILL;
            }
        }
        break;
        case COIN_FILL: {
            var has = 'coin' in map[row][col] || 'cube' in map[row][col];
            if (!has) {
                map[row][col]['coin'] = 1;
                addCoin(row, col);
            }
        }
        break;
        case CUBE: {
            var has = 'coin' in map[row][col] || 'cube' in map[row][col];
            if (!has) {
                map[row][col]['cube'] = 1;
                addCube(row, col);
            }
        }
        break;
        case DELETE: {
            if ('coin' in map[row][col]) {
                delete map[row][col]['coin'];
                divs[row][col].removeChild(divs[row][col].getElementsByClassName('coin')[0]);
            } else if ('cube' in map[row][col]) {
                delete map[row][col]['cube'];
                divs[row][col].removeChild(divs[row][col].getElementsByClassName('cube')[0]);
            } else {
                map[row][col] = {};
                divs[row][col].style.background = "none";
            }
        }
        break;
        case NEVERBALL: {
            var has = 'coin' in map[row][col] || 'cube' in map[row][col];
            if (!has) {
                addNeverball(row, col);
                map["neverball"] = {
                    pos: neverball_info.pos,
                    dir: neverball_info.dir
                };
            }
        }
        break;
        case GOAL: {
            var has = 'cube' in map[row][col];
            if (!has) {
                addGoal(row, col);
                map["goal"] = {
                    pos: goal_info.pos
                };
            }
        }
        break;
        case NONE:
            break;
        default:
            console.log("Invalid switch case");
            break;
        }
    }

    var createCoinFill = function () {
        var div = document.createElement('div');
        div.className = "coin";
        div.title = "金币"
        div.onclick = function () {
            cursel = COIN_FILL;
        }
        return div;
    }

    var createDelete = function () {
        var div = document.createElement('div');
        div.className = "btn";
        div.innerText = "删除";
        div.title = "删除已放置元素，但平衡球和目标点无法删除只能重设位置。";
        div.onclick = function () {
            cursel = DELETE;
        }
        return div;
    }

    var createNeverball = function () {
        var div = document.createElement('div');
        div.className = 'btn';
        div.innerText = "平衡球";
        div.title = "放置后平衡球后，光标放到平衡球上长按并拖拽可设置初始方向";
        div.onclick = function () {
            cursel = NEVERBALL;
        }
        return div;
    }

    var createTools = function () {
        tools[PICKER] = createPicker();
        tools[DELETE] = createDelete();
        tools[CUBE] = createCube();
        tools[COLOR_FILL] = createColorFill();
        tools[COIN_FILL] = createCoinFill();
        tools[NEVERBALL] = createNeverball();
        tools[GOAL] = createGoal();

        var toolbox = main.getElementsByClassName('toolbox')[0];
        for (var i in tools) {
            toolbox.appendChild(tools[i]);
        }

    }


    var createCells = function () {
        divs = {};
        map = {};
        grid.style.position = "relative";
        grid.style.width = cols * w + "px";
        grid.style.height = rows * h + "px";
        grid.innerHTML = "";

        for (var i = 0; i < rows; ++i) {
            divs[i] = {};
            map[i] = {};
            for (var j = 0; j < cols; ++j) {
                divs[i][j] = get(i, j);
                grid.appendChild(divs[i][j]);
                map[i][j] = {};
            }
        }

        for (var i = 0; i < rows; ++i) {
            for (var j = 0; j < cols; ++j) {
                var o = function (i, j) {
                    divs[i][j].onmousedown = function () {
                        // 阻止默认行为
                        event.preventDefault();
                        down = 1;
                        mouseEvent(i, j);
                    }

                    divs[i][j].onmousemove = function () {
                        if (down) mouseEvent(i, j, true);
                    }

                }
                o(i, j);
            }
        }

    }

    this.getLevel = function () {
        var r = {
            meta: {
                rows: rows,
                cols: cols
            },
            map: map
        };
        return r;
    }

    this.save = function (name) {
        lmanager.addLevel(name, this.getLevel());
        lmanager.save();
        displayLevels();
    }

    var deleteLevel = function (name) {
        lmanager.deleteLevel(name);
        displayLevels();
    }

    var editLevel = function (name) {
        var inp = main.getElementsByClassName('save_level_name')[0];
        inp.value = name;
        var level = lmanager.getLevel(name);
        rows = level.meta.rows;
        cols = level.meta.cols;
        resetInfo();
        createCells();
        map = level.map;
        for (var i = 0; i < rows; ++i) {
            for (var j = 0; j < cols; ++j) {
                divs[i][j].style.background = "none";
                divs[i][j].innerHTML = "";
                if ('color' in map[i][j]) {
                    divs[i][j].style.background = map[i][j]['color'];
                }
                if ('coin' in map[i][j]) {
                    addCoin(i, j);
                }
                if ('cube' in map[i][j]) {
                    addCube(i, j);
                }

            }
        }
        if ('neverball' in map) {
            var info = map['neverball'];
            addNeverball(info.pos.row, info.pos.col);
            setLine(info.dir.u, info.dir.v);
        }
        if ('goal' in map) {
            var info = map['goal'];
            addGoal(info.pos.row, info.pos.col);
        }
    }

    var displayLevels = function () {
        var obj = main.getElementsByTagName('ul')[0];
        var levels = lmanager.getLevels();
        obj.innerHTML = "";
        for (var i in levels) {
            var li = document.createElement('li');
            li.innerText = i;
            li.className = "level-li";
            li.style.position = 'relative';

            var cross = document.createElement('div');
            cross.innerText = 'X';
            cross.className = 'deletebtn';

            var o = function (li, i) {
                li.onclick = function () {
                    editLevel(i);
                }
                cross.onclick = function (e) {
                    e.stopPropagation();
                    deleteLevel(i);
                }
            }
            o(li, i);
            obj.appendChild(li);
            li.appendChild(cross);
        }
    }


    var createSaveTools = function () {
        var save_btn = main.getElementsByClassName('save_btn')[0];
        save_btn.onclick = function () {
            var inp = main.getElementsByClassName('save_level_name')[0];
            self.save(inp.value);
        }
    }

    /* 创建存档下载工具 */
    var createSaveDownloadTools = function () {
        var save_download_btn = main.getElementsByClassName('save_download_btn')[0];
        save_download_btn.onclick = function () {
            saveFileDownload();
        }
    }

    /* 创建存档上传工具 */
    var createSaveUploadTools = function () {
        var save_upload_btn = main.getElementsByClassName('save_upload_btn')[0];
        save_upload_btn.onclick = function () {
            saveFileUpload();
        }
    }

    /* 初始化 */
    this.init = function () {
        main.style.position = "relative";
        createCells();
        createTools();
        createSaveTools();
        displayLevels();
        createSaveDownloadTools();
        createSaveUploadTools();
        var back_btn = main.getElementsByClassName('back_btn')[0];
        back_btn.onclick = function () {
            window.location = "index.html";
        }

    }


}