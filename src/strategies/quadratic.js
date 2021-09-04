import sortResult from './sortResult.js';

export default function tally(data) {
	const totalVotes = {};
	let totalBalance = 0;
	// sum the square roots of the votes
	data.forEach(({voteWeights, balance}) => {
		totalBalance += balance;
		Object.keys(voteWeights).forEach((choice => {
			if (!totalVotes[choice]) {
				totalVotes[choice] = 0;
			}
			totalVotes[choice] += Math.sqrt(voteWeights[choice] * balance);
		}));
	});
	const choices = Object.keys(totalVotes);
	let adjustedVoteSum = 0;
	choices.forEach(choice => {
		// Square the totalled roots for each choice
		totalVotes[choice] = totalVotes[choice] ** 2;
		// Calculate the total for these adjusted votes across all choices
		adjustedVoteSum += totalVotes[choice];
	});
	// Scale each total vote so that they sum to the total amount of vote power used
	choices.forEach(choice => {
		totalVotes[choice] = (totalVotes[choice] / adjustedVoteSum) * totalBalance;
	});
	return sortResult(totalVotes);
}
