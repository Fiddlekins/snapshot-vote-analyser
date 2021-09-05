import formatTableMd from './utils/formatTableMd.js';

export default function formatResults(result) {
	const rows = [
		['Rank', 'Choice', 'Voters', 'Votes', 'Percent (%)']
	];
	result.forEach(({choice, voteCount, voterCount, percent, rank}) => {
		rows.push([rank, `Choice ${choice}`, voterCount, voteCount.toFixed(1), percent.toFixed(1)]);
	});
	return formatTableMd(rows);
};
