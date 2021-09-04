import path from 'path';
import {fileURLToPath} from 'url';
import formatResult from './formatResult.js';
import parseSnapshotData from './parseSnapshotData.js';
import strategies from './strategies/index.js';
import aggregateTable from './utils/aggregateTable.js';
import fs from './utils/fs.js';
import parseCsv from './utils/parseCsv.js';

const rootPath = path.join(fileURLToPath(import.meta.url), '..', '..');
const inputPath = path.join(rootPath, 'input');
const outputPath = path.join(rootPath, 'output');

async function main() {
	const filespecs = (await fs.readdir(inputPath)).map((filename) => {
		const extname = path.extname(filename);
		const basename = path.basename(filename, extname);
		return {filename, extname, basename};
	}).filter(({extname}) => {
		return extname === '.csv';
	});
	const files = await Promise.all(filespecs.map(async (filespec) => {
		const content = await fs.readFile(path.join(inputPath, filespec.filename), 'utf8');
		return {name: filespec.basename, content};
	}));
	await fs.ensureEmptyDir(outputPath);
	for (const file of files) {
		const rawValues = parseCsv(file.content);
		const table = aggregateTable(rawValues);
		const parsedTable = parseSnapshotData(table);
		const formattedLinearResult = formatResult(strategies.linear(parsedTable));
		const formattedQuadraticResult = formatResult(strategies.quadratic(parsedTable));
		const output = [
			'# Results with different strategies',
			'',
			'## Linear',
			formattedLinearResult,
			'',
			'## Quadratic',
			formattedQuadraticResult,
			''
		].join('\n');
		await fs.writeFile(path.join(outputPath, `${file.name}.md`), output, 'utf8');
	}
}

main().catch(console.error);
