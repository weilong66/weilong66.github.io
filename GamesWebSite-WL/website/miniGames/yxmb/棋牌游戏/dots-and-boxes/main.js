function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// $(function() {
// 	w = getParameterByName('width');
// 	h = getParameterByName('height');

// 	if (w=='' || h=='' || w==null || h==null) {
// 		$('#game').html("<p align='center'>Set the width and height values</p>")
// 		return
// 	}

// 	$("#width").val(w).parent().addClass('is-dirty')
// 	$("#height").val(h).parent().addClass('is-dirty')

// 	initgameboard(h, w)
// })

function displayMessage(message) {
	const gameStatusMessage = document.getElementById('game-status-message');
	if (gameStatusMessage) {
		gameStatusMessage.innerHTML = message;
		gameStatusMessage.style.display = 'block';
		setTimeout(() => {
			gameStatusMessage.style.display = 'none';
		}, 3000)
	}
}

function savestate(message) {
	//保存到历史记录，以便用户可以通过浏览器的前进/后退按钮恢复游戏
	window.history.replaceState({'html': $('#gamesec').html()}, '', window.location.href);
	//保存到sessionStorage
	// localStorage.setItem('savedGameState', $('#gamesec').html());

	displayMessage('游戏进度已保存,可通过浏览器前进/后退按钮恢复');
}

function setWHVals() {
	// savestate();
	window.history.replaceState({'html': $('#gamesec').html()}, '', window.location.href);

	w = parseInt($('#width').val())
	h = parseInt($('#height').val())

	initgameboard(h, w)
	// window.history.pushState({'html': $('#gamesec').html()}, '', './?width=' + w + '&height=' + h)
	window.history.pushState({'html': $('#gamesec').html()}, '', window.location.href);
}
window.onpopstate = function (e) {
	if (e.state) {
		// console.log(e.state.html)
		$('#gamesec').html(e.state.html);

		// w = getParameterByName('width');
		w = $('#gameboard').attr('gwidth')
		// h = getParameterByName('height');
		h = $('#gameboard').attr('gheight')

		$("#width").val(w).parent().addClass('is-dirty')
		$("#height").val(h).parent().addClass('is-dirty')

		for (var i = 0; i < w * 2 + 1; i++) {
			nom = "";
			if (i % 2 == 0) {
				nom = "gameboard-row-h" + i / 2;
			} else {
				nom = "gameboard-row-v" + Math.floor(i / 2);
			}

			for (var j = 0; j < h * 2 + 1; j++) {
				if (i % 2 == 0) {
					if (j % 2 == 0) {} else {
						nom2 = nom + "-cell-e" + Math.floor(j / 2);
						$("#" + nom2).hover(mouseon, mouseoff).click(mouseclick);
					}
				} else {
					if (j % 2 == 0) {
						nom2 = nom + "-cell-e" + j / 2;
						$("#" + nom2).hover(mouseon, mouseoff).click(mouseclick);
					} else {
						nom2 = nom + "-cell-b" + Math.floor(j / 2);
						$("#" + nom2).hover(mouseon, mouseoff);
					}
				}
			}
		}
	}
};

initgameboard = function (h, w) {
	resetgameboard()

	$('#game').html('<table id="gameboard"></table>')
	$('#gameboard')
		.attr('bgcolor', '#ffffff')
		.attr('border', '0')
		.attr('cellpadding', '0')
		.attr('cellspacing', '0')
		.attr('align', 'center')
		.attr('gwidth', w)
		.attr('gheight', h)

	for (var i = 0; i < w * 2 + 1; i++) {
		nom = "";
		if (i % 2 == 0) {
			nom = "gameboard-row-h" + i / 2;
			$('#gameboard').append("<tr id='" + nom + "'> </ tr>")
		} else {
			nom = "gameboard-row-v" + Math.floor(i / 2);
			$('#gameboard').append("<tr id='" + nom + "'> </ tr>")
		}

		for (var j = 0; j < h * 2 + 1; j++) {
			if (i % 2 == 0) {
				if (j % 2 == 0) {
					nom2 = nom + "-cell-c" + j / 2;
					$("#" + nom).append("<td class='gameboard-corner' id='" + nom2 + "'></td>")
				} else {
					nom2 = nom + "-cell-e" + Math.floor(j / 2);
					$("#" + nom).append("<td class='gameboard-edgeh' id='" + nom2 + "'></td>")
					$("#" + nom2).hover(mouseon, mouseoff).click(mouseclick)
						.attr('y', Math.floor(j / 2)).attr('x', i / 2).attr('hv', 'h');
				}
			} else {
				if (j % 2 == 0) {
					nom2 = nom + "-cell-e" + j / 2;
					$("#" + nom).append("<td class='gameboard-edgev' id='" + nom2 + "'></td>")
					$("#" + nom2).hover(mouseon, mouseoff).click(mouseclick)
						.attr('y', j / 2).attr('x', Math.floor(i / 2)).attr('hv', 'v');
				} else {
					nom2 = nom + "-cell-b" + Math.floor(j / 2);
					$("#" + nom).append("<td class='gameboard-box' id='" + nom2 + "'></td>")
					$("#" + nom2).hover(mouseon, mouseoff)
						.attr('y', Math.floor(j / 2))
						.attr('x', Math.floor(i / 2))
						.attr('hv', 'b');
				}
			}
		}
	}
}

resetgameboard = function () {
	$('#game').html('')

	playerturn = 1
	setturnsignal($('#turn-signal'));


	playerscores = [0, 0, 0]
	setplayerscore(1);
	setplayerscore(2);

}

mouseon = function () {
	// $(this).addClass('edge-hover')
	$(this).addClass('color-hp' + playerturn);
	// console.log($(this).attr('x') + "-" + $(this).attr('y') + "-" + $(this).attr('hv'))

	hv = $(this).attr('hv');
	x = parseInt($(this).attr('x'));
	y = parseInt($(this).attr('y'));
	checkgrid(this, 0)
}
mouseoff = function () {
	// $(this).removeClass('edge-hover')
	$(this).removeClass('color-hp' + playerturn);

	hv = $(this).attr('hv');
	x = parseInt($(this).attr('x'));
	y = parseInt($(this).attr('y'));
	checkgrid(this, -1)
}

playerturn = "1";
playerscores = [0, 0, 0];

mouseclick = function () {
	$(this).mouseleave()
	$(this).addClass('color-p' + playerturn);
	$(this).addClass('picked');

	$(this).off("click")
	$(this).off("mouseenter")
	$(this).off("mouseleave")

	hv = $(this).attr('hv');
	x = parseInt($(this).attr('x'));
	y = parseInt($(this).attr('y'));
	check = checkgrid(this, 1)
	// console.log("checked " + check)
	if (check != 0) {
		playerscores[playerturn] += 1;
		$('#player' + playerturn + "-score").html('玩家 ' + playerturn + " 得分: " + playerscores[playerturn])
		setplayerscore(playerturn)
	} else {
		playerturn = 3 - playerturn;
		setturnsignal($('#turn-signal'));
	}
}
setturnsignal = function (e) {
	if (playerturn == 1) {
		e.html("轮到玩家 A")
	} else {
		e.html("轮到玩家 B")
	}
}
setplayerscore = function (playerturn) {
	playerturnN = ''
	if (playerturn == 1) {
		playerturnN = 'A'
	} else if (playerturn == 2) {
		playerturnN = 'B'
	}
	$('#player' + playerturn + "-score").html('玩家 ' + playerturnN + " 得分: " + playerscores[playerturn])
}
cellfrompos = function (hv, x, y) {
	return "gameboard-row-" + hv + "" + x + "-cell-e" + y;
}
blkfrompos = function (x, y) {
	return "gameboard-row-v" + x + "-cell-b" + y;
}
checkgrid = function (e, clicked) {
	hv = $(e).attr('hv');
	x = parseInt($(e).attr('x'));
	y = parseInt($(e).attr('y'));
	// logedge(hv, x, y, 'scanning')
	c = 0;
	if (hv == 'h') {
		if (checkedge('h', x - 1, y) && checkedge('v', x - 1, y) && checkedge('v', x - 1, y + 1)) {
			if (clicked == 1) {
				$('#' + blkfrompos(x - 1, y)).addClass('color-p' + playerturn + '-score');
			} else if (clicked == 0) {
				$('#' + blkfrompos(x - 1, y)).addClass('color-hp' + playerturn);
			} else if (clicked == -1) {
				$('#' + blkfrompos(x - 1, y)).removeClass('color-hp' + playerturn);
			}
			c += +1
			// console.log('CHECKMATE h' + -1)
		}
		if (checkedge('h', x + 1, y) && checkedge('v', x, y) && checkedge('v', x, y + 1)) {
			if (clicked == 1) {
				$('#' + blkfrompos(x, y)).addClass('color-p' + playerturn + '-score');
			} else if (clicked == 0) {
				$('#' + blkfrompos(x, y)).addClass('color-hp' + playerturn);
			} else if (clicked == -1) {
				$('#' + blkfrompos(x, y)).removeClass('color-hp' + playerturn);
			}
			c += +1
			// console.log('CHECKMATE h' + 1)
		}
	} else if (hv == 'v') {
		if (checkedge('v', x, y - 1) && checkedge('h', x, y - 1) && checkedge('h', x + 1, y - 1)) {
			if (clicked == 1) {
				$('#' + blkfrompos(x, y - 1)).addClass('color-p' + playerturn + '-score');
			} else if (clicked == 0) {
				$('#' + blkfrompos(x, y - 1)).addClass('color-hp' + playerturn);
			} else if (clicked == -1) {
				$('#' + blkfrompos(x, y - 1)).removeClass('color-hp' + playerturn);
			}
			c += +1
			// console.log('CHECKMATE v' + -1);
		}
		if (checkedge('v', x, y + 1) && checkedge('h', x, y) && checkedge('h', x + 1, y)) {
			if (clicked == 1) {
				$('#' + blkfrompos(x, y)).addClass('color-p' + playerturn + '-score');
			} else if (clicked == 0) {
				$('#' + blkfrompos(x, y)).addClass('color-hp' + playerturn);
			} else if (clicked == -1) {
				$('#' + blkfrompos(x, y)).removeClass('color-hp' + playerturn);
			}
			c += +1
			// console.log('CHECKMATE v' + 1)
		}
	}
	return c;
}
checkedge = function (hv, x, y) {
	a = $("#" + cellfrompos(hv, x, y)).hasClass('picked')
	// logedge(hv, x, y, "checking", a);
	return a
}
logedge2 = function (pre, post) {
	if (pre == undefined) pre = ""
	else pre = pre + ": ";
	if (post == undefined) post = ""
	else post = "-" + post;
	console.log(pre + $(this).attr('x') + "-" + $(this).attr('y') + "-" + $(this).attr('hv') + post)
}
logedge = function (hv, x, y, pre, post) {
	if (pre == undefined) pre = ""
	else pre = pre + ": ";
	if (post == undefined) post = ""
	else post = "-" + post;
	console.log(pre + x + "-" + y + "-" + hv + post)
}