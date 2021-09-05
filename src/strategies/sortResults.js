export default function sortResults(result) {
	const voteCountTotal = Object.values(result).reduce((acc, curr) => acc + curr.voteCount, 0);
	return Object.keys(result).map((choice) => {
		const {voteCount, voterCount} = result[choice];
		const percent = 100 * voteCount / voteCountTotal;
		return {choice, voteCount, percent, voterCount};
	}).sort((a, b) => {
		return b.voteCount - a.voteCount;
	}).map((result, index) => {
		result.rank = index + 1;
		return result;
	});
};
