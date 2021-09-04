export default function parseSnapshotData(table) {
	return table.map(row => {
		const {address, authorIpfsHash} = row;
		const timestamp = parseInt(row.timestamp, 10) * 1000;
		const balance = parseFloat(row.balance);
		const choiceIndexes = [];
		Object.keys(row).forEach((key) => {
			const match = key.match(/choice.(\d+)/);
			if (match) {
				choiceIndexes.push(parseInt(match[1], 10));
			}
		});
		const totalVoteWeight = choiceIndexes.reduce((acc, choiceIndex) => {
			const voteWeight = parseInt(row[`choice.${choiceIndex}`], 10);
			return acc + voteWeight;
		}, 0);
		const voteWeights = {};
		choiceIndexes.forEach((choiceIndex) => {
			const voteWeight = parseInt(row[`choice.${choiceIndex}`], 10);
			voteWeights[choiceIndex] = voteWeight / totalVoteWeight;
		});
		return {
			address,
			authorIpfsHash,
			timestamp,
			balance,
			voteWeights
		};
	});
}