export default function aggregateTable(values) {
	const headers = values[0];
	const rows = [];
	for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
		const row = {};
		headers.forEach((key, columnIndex) => {
			const value = values[rowIndex][columnIndex];
			if (value && value.length) {
				row[key] = value;
			}
		})
		rows.push(row);
	}
	return rows;
}
