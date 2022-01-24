let d = n => Math.floor(Math.random() * n) + 1;

let rollStats = () => {
	let stats = [];
	for (let i = 0; i < 6; ++i) {
		stats.push([d(6), d(6), d(6), d(6)].sort().splice(1).reduce((sum, x) => sum + x, 0));
	}
	return stats.sort((a, b) => b - a);
};

let pointBuy = (costs, stats) => {
	stats.sort((a, b) => b - a);
	abilities = Object.keys(costs).sort((a, b) => b - a);
	if (stats[0] > abilities[0] || stats[stats.length - 1] < abilities[abilities.length - 1]) {
		return NaN;
	} else {
		return stats.reduce((points, stat) => points + costs[stat], 0);
	}
};

let rollPointBuy = (costs, points = 27) => {
	while (true) {
		let stats = rollStats();
		if (pointBuy(costs, stats) == points) return stats;
	}
};

let generateFreqTable = (iterations, costs = {}) => {
	let freqTable = {};
	let costExist = Object.entries(costs).length;
	for (let i = 0; i < iterations; ++i) {
		let stats = (costExist?rollPointBuy(costs):rollStats()).join();
		if (stats in freqTable) {
			++freqTable[stats];
		} else {
			freqTable[stats] = 1;
		}
	}
	return freqTable;
};

let n = 1000000;

let costs = {};
costs[8]  = 0;
costs[9]  = 1;
costs[10] = 2;
costs[11] = 3;
costs[12] = 4;
costs[13] = 5;
costs[14] = 7;
costs[15] = 9;

let results = generateFreqTable(n, costs);
csv = '';
for (const [key,value] of Object.entries(results)) {
		csv += key + ',' + value + '\n';
}
console.log(csv);
