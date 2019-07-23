const fs = require('fs');
const path = require('path');

function scanDir (dir) {
}

function has$Prefix (ent) {

}

function go (dir) {
	const entries = fs.readdirSync(dir);

	entries.forEach((ent) => {

		if (ent[0] === '$') {
			// console.log(`${dir}/${ent} --> ${dir}/_${ent.substr(1)}`);
			fs.renameSync(`${dir}/${ent}`, `${dir}/_${ent.substr(1)}`)
		}
		else {
			const stat = fs.statSync(`${dir}/${ent}`);

			if (stat.isDirectory()) {
				go(`${dir}/${ent}`);
				return;
			}
			// else if (stat.isFile()) {

			// }
			// else {
			// 	console.log('ELSE!!!');
			// 	console.log(ent);
			// 	console.log(stat);
			// }
		}
	})
}





go('./tests/app-folders');
