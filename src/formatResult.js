export default function formatResult(result) {
	const rows = [
		['Rank', 'Choice', 'Votes', 'Percent (%)']
	];
	rows.push(rows[0].map(() => '---'));
	result.forEach(({choice, voteCount, percent}, index) => {
		rows.push([index + 1, `Choice ${choice}`, voteCount.toFixed(1), percent.toFixed(1)]);
	});
	return rows.map(row => {
		row.unshift('');
		row.push('');
		return row.join(' | ');
	}).join('\n');
};
