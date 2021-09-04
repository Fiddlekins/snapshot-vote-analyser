import fsDefault from 'fs/promises';

const fs = {...fsDefault};

fs.ensureDir = async (...args) => {
	try {
		await fs.mkdir(...args);
	} catch (err) {
		// don't care
	}
}

fs.ensureEmptyDir = async (dir) => {
	try {
		await fs.rm(dir, {recursive: true});
	} catch (err) {
		// don't care
	}
	await fs.ensureDir(dir);
}

fs.getDirectories = async (dir) => {
	const contents = await fs.readdir(dir, {withFileTypes: true});
	return contents.filter((dirEnt) => dirEnt.isDirectory()).map((dirEnt) => dirEnt.name);
}

fs.readJSON = async (dir) => {
	const text = await fs.readFile(dir);
	return JSON.parse(text);
}

fs.writeJSON = async (dir, json, pretty) => {
	const data = pretty ? JSON.stringify(json, null, '\t') : JSON.stringify(json);
	await fs.writeFile(dir, data, 'utf8');
}

export default fs;
