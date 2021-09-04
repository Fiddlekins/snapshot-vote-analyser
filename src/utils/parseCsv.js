function parseLine(line) {
	const values = [];
	let inEscaped = false;
	let shouldStripEscapeChars = false
	let startIndex = 0;
	for (let i = 0; i < line.length; i++) {
		const char = line.charAt(i);
		if (char === '"') {
			inEscaped = !inEscaped;
			if (inEscaped) {
				shouldStripEscapeChars = true;
			}
		}
		if (!inEscaped && char === ',') {
			if (shouldStripEscapeChars) {
				shouldStripEscapeChars = false;
				values.push(line.slice(startIndex + 1, i - 1));
			} else {
				values.push(line.slice(startIndex, i));
			}
			startIndex = i + 1;
		}
	}
	values.push(line.slice(startIndex, line.length));
	return values;
}

export default function parseCsv(input) {
	const lines = input.split(/\r\n|\n\r|\n/g);
	return lines.map(parseLine);
}
