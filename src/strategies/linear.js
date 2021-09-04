import sortResult from './sortResult.js';

export default function tally(data) {
	const totalVotes = {};
	data.forEach(({voteWeights, balance}) => {
		Object.keys(voteWeights).forEach((choice => {
			if (!totalVotes[choice]) {
				totalVotes[choice] = 0;
			}
			totalVotes[choice] += voteWeights[choice] * balance;
		}));
	});
	return sortResult(totalVotes);
}
