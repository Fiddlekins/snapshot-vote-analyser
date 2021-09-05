import sortResults from './sortResults.js';

export default function tally(data) {
	const totalVotes = {};
	data.forEach(({voteWeights, balance}) => {
		Object.keys(voteWeights).forEach((choice => {
			if (!totalVotes[choice]) {
				totalVotes[choice] = {
					voteCount: 0,
					voterCount: 0
				};
			}
			totalVotes[choice].voteCount += voteWeights[choice] * balance;
			totalVotes[choice].voterCount += 1;
		}));
	});
	return sortResults(totalVotes);
}
