fetch('word list.json')
	.then(response => response.text())
	.then(data => {
		let word_list = JSON.parse(data);
	});

function remove_element(array, element) {
	const index = array.indexOf(element);
	if (index > -1) array.splice(index, 1);
}

let wordle = {
	correct: {},
	wrong_spot: {},
	incorrect: [],
	word_list: [...word_list],

	reset: () => {
		wordle.correct = {};
		wordle.wrong_spot = {};
		wordle.incorrect = [];
		wordle.word_list = [...word_list];
	},

	remove: (word) => {
		remove_element(word_list, word);
		remove_element(wordle.word_list, word);
		console.log(JSON.stringify(word_list));
	},

	update: (guess, values) => {
		let guess_array = guess.split('');
		let values_array = values.split('');
		for (let i = 0; i < 5; i++) {
			if (values_array[i] == 'c' && !(guess_array[i] in wordle.correct)) {
				wordle.correct[guess_array[i]] = i;
				if (guess_array[i] in wordle.wrong_spot) delete wordle.wrong_spot[guess_array[i]];
			}
			if (values_array[i] == 'i' && !(wordle.incorrect.includes(guess_array[i]))) wordle.incorrect.push(guess_array[i]);
			if (values_array[i] == 'w') {
				if (guess_array[i] in wordle.wrong_spot && !(wordle.wrong_spot[guess_array[i]].includes(i))) wordle.wrong_spot[guess_array[i]].push(i);
				else if (!(guess_array[i] in wordle.wrong_spot)) wordle.wrong_spot[guess_array[i]] = [i];
			}
		}
	},

	guess: () => {
		let correct = wordle.correct;
		let incorrect = wordle.incorrect;
		let wrong_spot = wordle.wrong_spot;
	
		function filter_correct(word) {
			let word_array = word.split('');
			for (const [letter, index] of Object.entries(correct)) {
				if (word_array[index] != letter) return false;
			}
			return true;
		}
	
		function filter_wrong_spot(word) {
			let word_array = word.split('');
			for (const [letter, indexes] of Object.entries(wrong_spot)) {
				if (!word.includes(letter)) return false;
				for (const index of indexes) {
					if (word_array[index] == letter) return false;
				}
			}
			return true;
		}
	
		function filter_incorrect(word) {
			for (const letter of incorrect) {
				if (word.includes(letter)) return false;
			}
			return true;
		}
	
		wordle.word_list = wordle.word_list.filter(filter_correct).filter(filter_wrong_spot).filter(filter_incorrect);
	
		return wordle.word_list;
	},

	do: (guess, values) => {
		wordle.update(guess, values);
		return wordle.guess()[0];
	}
}
