export default function sortResult(result) {
	const voteCountTotal = Object.values(result).reduce((acc, curr) => acc + curr, 0);
	return Object.keys(result).map((choice) => {
		const voteCount = result[choice];
		const percent = 100 * voteCount / voteCountTotal;
		return {choice, voteCount, percent};
	}).sort((a, b) => {
		return b.voteCount - a.voteCount;
	});
};
