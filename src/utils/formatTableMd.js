export default function formatTableMd(array2d) {
	const headers = array2d[0];
	const rows = [
		headers,
		headers.map(() => '---'),
		...array2d.slice(1)
	];
	return rows.map(row => {
		row.unshift('');
		row.push('');
		return row.join(' | ');
	}).join('\n');
}
