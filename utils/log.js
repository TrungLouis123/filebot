const chalk = require('chalk');

module.exports = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.rgb(127,255,0)('◁  💗WARN-PCODER💗  ▷ ') + data);
			break;
		case "error":
			console.log(chalk.rgb(255,20,147)('◁  💗ERROR-PCODER💗  ▷ ') + data);
			break;
		default:
			console.log(chalk.rgb(230,230,230)(`${option} » `) + data);
			break;
	}
}

module.exports.loader = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.rgb(0,206,209)('─💸 🐰𝐏-𝐂𝐎𝐃𝐄𝐑🐰 💗─ ▷ ') + data);
			break;
		case "error":
			console.log(chalk.rgb(255,105,180)('─🐉 🐰𝐏-𝐂𝐎𝐃𝐄𝐑🐰 🐍─ ▷ ') + data);
			break;
		default:
			console.log(chalk.rgb(64,224,208)(`─💸 🐰𝐏-𝐂𝐎𝐃𝐄𝐑🐰 🐍─ ▷ `) + data);
			break;
	}
}
