function Klotski(elem, btn) {
	// 先把自己用变量储存起来,后面要用
	var myself = this;

	//步数统计
	var count = 0;

	//	if (!window.layer)
	//		throw new Error('Klotski need layer.js');

	var $elem = $(elem),
		$startBtn = $(btn);
	$elem.addClass('layui-row layui-col-space1 box');
	var noNum = 'no-num',
		defRadix = 3,
		isStop = true;

	//1.先默认显示1-8类数字，以示规则：
	myself.init = function (radix) {
		radix = getRadix(radix);
		for (var i = 1; i < radix * radix; i++) {
			$elem.append('<div class="layui-col-xs1 box-item" ' + getItemStyle(radix) + '><div>' + i + '</div></div>');
		}
		$elem.append('<div class="layui-col-xs1 box-item no-num" ' + getItemStyle(radix) + '><div></div></div>');
		$elem.after('<audio src="./mp3/fall.mp3"></audio>');

		// 添加事件：
		addEventListener(radix);
	}

	// 2.重新、开始游戏
	myself.restart = function (radix) {
		count = 0; //重置步数统计
		radix = getRadix(radix);
		var array = getTempArray(radix);
		$elem.html('');
		$.each(array, function (i, number) {
			$elem.append('<div class="layui-col-xs1 box-item" ' + getItemStyle(radix) + '><div>' + number + '</div></div>');
		});
		$elem.append('<div class="layui-col-xs1 box-item no-num" ' + getItemStyle(radix) + '><div style="display:none;">' + Math.pow(radix, 2) + '</div></div>');

		if (checkGameOver(false))
			return myself.restart(radix);
		isStop = false;
		// 添加事件：
		addEventListener(radix);
	}

	/**
	 * @see 数列的逆序数为偶数
	 * @see 数字华容道，必然有解，只存在于如下3个细分情形：
	 * @see 若格子列数为奇数，则逆序数必须为偶数；
	 * @see 若格子列数为偶数，且逆序数为偶数，则当前空格所在行数与初始空格所在行数的差为偶数；
	 * @see 若格子列数为偶数，且逆序数为奇数，则当前空格所在行数与初始空格所在行数的差为奇数。
	 */
	function getTempArray(radix) {
		var array = [];
		for (var i = 1; i < radix * radix; i++)
			array.push(i);
		array.sort(function () {
			return Math.random() - 0.5;
		});
		if (!canUse(array))
			return getTempArray(radix);
		return array;
	}

	// 判断生成的数组是否符合规则
	function canUse(numbers) {
		// 声明标识逆序数的个数
		var ivsNumber = 0;
		// 遍历数组
		for (var i = 0; i < numbers.length; i++) {
			for (var j = i + 1; j < numbers.length; j++) {
				// 依次两两对比,判断前一个是否比后一个大
				if (numbers[i] > numbers[j]) {
					// 是,则ivsNumber加1
					ivsNumber++;
				}
			}
		}
		// 判断ivsNumber变量是否为偶数
		return (ivsNumber % 2 == 0);
	}

	function getRadix(radix) {
		radix = !radix || isNaN(radix) ? defRadix : parseInt(radix);
		return defRadix = Math.max(Math.min(radix, 30), 3);
	}

	function getItemStyle(radix) {
		var w = chuyu(300, radix),
			fs = [0, 100, 80, 60, 40, 30, 30, 24, 20, 18, 16, 14, 12, 10, 10][radix];
		return 'style="width:' + w + 'px;height:' + w + 'px;line-height:' + w + 'px;font-size:' + (fs || 10) + 'px;"';
	}

	function msg(msg, isAlert) {
		if (window.layer)
			return isAlert ? layer.alert(msg) : layer.msg(msg);
		return alert(msg);
	}

	function addEventListener(radix) {
		$elem.find('.box-item').click(function () {
			if (isStop) return msg('请先开始游戏！');
			var $me = $(this);
			if ($me.hasClass(noNum)) return; //点击了空！
			var html = $me.html();
			var index = $elem.find('.box-item').index(this) + 1;
			var bln, check = function ($target) {
				if ($target.length > 0 && $target.hasClass(noNum)) {
					$me.html($target.html()).addClass(noNum);
					$target.html(html).removeClass(noNum);
					return true;
				}
				return false;
			};
			//上
			if (!bln && index - radix > 0) {
				bln = check($elem.find('.box-item:eq(' + (index - radix - 1) + ')'));
				
			}
			//下
			if (!bln) {
				bln = check($elem.find('.box-item:eq(' + (index + radix - 1) + ')'));
			}
			//左
			if (!bln && index % radix != 1) {
				bln = check($me.prev());
			}
			//右
			if (!bln && index % radix != 0) {
				bln = check($me.next());
			}
			if (bln) {
				count++;
				checkGameOver(bln);
				$elem.next('audio')[0].play();
			}
		});
		if ($startBtn.length > 0)
			$startBtn.text(isStop ? '开始游戏' : '重新开始');
	}

	function checkGameOver(isTips) {
		var isOver = true;
		$elem.find('.box-item').each(function (index, item) {
			var $me = $(item),
				text = $me.text();
			if (!text || $me.hasClass(noNum)) return; //空！
			if (index + 1 != text)
				return isOver = false;
		});
		if (isOver && isTips) {
			isStop = true;
			msg('恭喜您，游戏通关！\n所用步数：' + count, true);
			if ($startBtn.length > 0)
				$startBtn.text('重新开始');
		}
		return isOver;
	}

	function chuyu(m, n) {
		return n == 0 ? 0 : m / n;
	}

	return myself.init();
}