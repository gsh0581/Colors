class ColorGame {
	constructor(userOption) {
		this.option = {
			time: 30, // 总时长
			end: score => {
				document.getElementById("screen").innerHTML = `<div class="result" style="width: 100%;">
				<div class="block-inner" id="restart"> You score is ${score} <br/> click to start again</div>
			  </div>`;
				addEvent(document.getElementById("restart"), "click", () => {
					this.init();
				})
			}
		}
		this.init(userOption);

	}
	// 初始化
	init(userOption) {
		this.step = 0;
		this.score = 0;
		if (userOption) {
			if (Object.assign) {
				Object.assign(this.option, userOption);  // es6写法
			}
			else {
				extend(this.option, userOption, true);  // 兼容性写法
			}
		}
		this.time = this.option.time;
		document.getElementsByClassName("wgt-score")[0].innerHTML = `
			得分：：<span id="score">${this.score}</span>
			时间：<span id="timer">${this.time}</span>`;

		// 计时方法
		window.timer = setInterval(() => {
			if (this.time === 0) {
				// 如果时间为0 ，clearInterval，调用end方法
				clearInterval(window.timer);
				this.option.end(this.score);
			}
			else {
				this.time--;
				document.getElementById("timer").innerHTML = this.time;
			}
		}, 1000)
		this.nextStep(); // 下一关

	}
	nextStep() {
		// 记录level
		this.step++;
		let col;// 列数
		// 最大不超过16列
		if (this.step < 6) {
			col = this.step + 1;
		} else if (this.step < 12) {
			col = Math.floor(this.step / 2) * 2;
		} else if (this.step < 18) {
			col = Math.floor(this.step / 3) * 3;
		} else {
			col = 16;
		}
		// 小盒子宽度
		let blockWidth = ((100 / col).toFixed(2) * 100 - 1) / 100;
		// 随机盒子index
		let randomBlock = Math.floor(col * col * Math.random());

		let [normalColor, specialColor] = getColor(this.step);

		// es6 模板字符串
		let item = `<div class="block" style="width: ${blockWidth}%;">
		<div class="block-inner" style="background-color: #${normalColor}"></div>
	  </div>`;
		// 包含所有盒子的数组
		let arr = [];
		for (let i = 0; i < col * col; i++) {
			arr.push(item);
		}
		arr[randomBlock] = `<div class="block" style="width: ${blockWidth}%;">
		<div class="block-inner" style="background-color: #${specialColor}" id="special-block"></div>
	  </div>`;
	  document.getElementById("screen").innerHTML = arr.join('');
		addEvent(document.getElementById("special-block"), "click", () => {
			this.nextStep();
			this.score++;
			//修改得分
			document.getElementById("score").innerHTML = this.score;
		});
	}

}
// 合并参数方法
function extend(o, n, override) {
	for (const p in n) {
		if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) {
			o[p] = n[p];
		}
	}

}
/**
 * 
 * @param {*} step 
 */
function getColor(step) {

	// rgb 随机加减 random
	let random = Math.floor(100 / step);

	// 获取随机一般颜色，拆分三色值
	let color = randomColor(17, 255),
		m = color.match(/[\da-z]{2}/g);

	// 转化为10进制
	for (let i = 0; i < m.length; i++) {
		m[i] = parseInt(m[i], 16);
	}
	let specialColor =
		getRandomColorNumber(m[0], random) +
		getRandomColorNumber(m[1], random) +
		getRandomColorNumber(m[2], random);
	return [color, specialColor];
}
/**
 * 获取随机颜色相近的rgb三色值
 * @param {number} num 单色值
 * @param {number} random 随机加减的数值
 */
function getRandomColorNumber(num, random) {

	let temp = Math.floor(num + (Math.random() < 0.5 ? -1 : 1) * random);
	if (temp > 255) {
		return "ff";
	} else if (temp > 16) {
		return temp.toString(16);
	} else if (temp > 0) {
		return "0" + temp.toString(16);
	} else {
		return "00";
	}
}
/**
 * 随机颜色
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
function randomColor(min, max) {
	var r = randomNum(min, max).toString(16);
	var g = randomNum(min, max).toString(16);
	var b = randomNum(min, max).toString(16);
	return r + g + b;
}
/**
 * 指定范围内的随机数字
 * @param {number} min 最小范围
 * @param {number} max 最大范围
 */
function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
function addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + type, handler);
	} else {
		element["on" + type] = handler;
	} //兼容性处理
}