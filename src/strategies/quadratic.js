import sortResults from './sortResults.js';

// Strategy implementation derived from https://github.com/snapshot-labs/snapshot/blob/develop/src/helpers/voting/quadratic.ts

export default function tally(data) {
	const totalVotes = {};
	let totalBalance = 0;
	// sum the square roots of the votes
	data.forEach(({voteWeights, balance}) => {
		totalBalance += balance;
		Object.keys(voteWeights).forEach((choice => {
			if (!totalVotes[choice]) {
				totalVotes[choice] = {
					voteCount: 0,
					voterCount: 0
				};
			}
			totalVotes[choice].voteCount += Math.sqrt(voteWeights[choice] * balance);
			totalVotes[choice].voterCount += 1;
		}));
	});
	const choices = Object.keys(totalVotes);
	let adjustedVoteSum = 0;
	choices.forEach(choice => {
		// Square the totalled roots for each choice
		totalVotes[choice].voteCount = totalVotes[choice].voteCount ** 2;
		// Calculate the total for these adjusted votes across all choices
		adjustedVoteSum += totalVotes[choice].voteCount;
	});
	// Scale each total vote so that they sum to the total amount of vote power used
	choices.forEach(choice => {
		totalVotes[choice].voteCount = (totalVotes[choice].voteCount / adjustedVoteSum) * totalBalance;
	});
	return sortResults(totalVotes);
}
