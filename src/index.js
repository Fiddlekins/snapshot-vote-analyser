import path from 'path';
import {fileURLToPath} from 'url';
import formatResults from './formatResults.js';
import parseSnapshotData from './parseSnapshotData.js';
import strategies from './strategies/index.js';
import aggregateTable from './utils/aggregateTable.js';
import formatTableMd from './utils/formatTableMd.js';
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
		const linearResults = strategies.linear(parsedTable);
		const quadraticResults = strategies.quadratic(parsedTable);

		const combinedResults = [['Choice', 'Voters', 'Linear Rank', 'Linear Votes', 'Linear Percent (%)', 'Quadratic Rank', 'Quadratic Votes', 'Quadratic Percent (%)']];
		const linearChoiceToIndexMap = {};
		Object.values(linearResults).forEach((result, index) => {
			linearChoiceToIndexMap[result.choice] = index;
		});
		const quadraticChoiceToIndexMap = {};
		Object.values(quadraticResults).forEach((result, index) => {
			quadraticChoiceToIndexMap[result.choice] = index;
		});
		Object.keys(linearChoiceToIndexMap).forEach((choice) => {
			const linearResult = linearResults[linearChoiceToIndexMap[choice]];
			const quadraticResult = quadraticResults[quadraticChoiceToIndexMap[choice]];
			combinedResults.push([
				`Choice ${choice}`,
				linearResult.voterCount,
				linearResult.rank,
				linearResult.voteCount.toFixed(1),
				linearResult.percent.toFixed(1),
				quadraticResult.rank,
				quadraticResult.voteCount.toFixed(1),
				quadraticResult.percent.toFixed(1)
			]);
		});

		const output = [
			'# Results with different strategies',
			'',
			'## Linear',
			formatResults(linearResults),
			'',
			'## Quadratic',
			formatResults(quadraticResults),
			'',
			'## Combined',
			formatTableMd(combinedResults),
			''
		].join('\n');
		await fs.writeFile(path.join(outputPath, `${file.name}.md`), output, 'utf8');
	}
}

main().catch(console.error);
