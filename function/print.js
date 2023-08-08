// 14% 则 打印 14个*


// 将 15% 转换为 数字 15

function percent2Number(percent) {
	return parseInt(percent.replace('%', ''))
}

const printStars = percent => '*'.repeat(percent2Number(percent))

module.exports = printStars;