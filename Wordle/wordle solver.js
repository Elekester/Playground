class Wordle {
	constructor(legal_guesses, legal_answers) {
		/**
		 * The letters that have been correctly guessed.
		 * @property {[number]} [a] - Indicates the positions of correctly guessed letters a in the wordle. A similar property exists for each letter of the alphabet.
		 */
		this.correct = {};
		
		/**
		 * The letters that have been guessed in the wrong positions.
		 * @property {[number]} [a] - Indicates the positions of that the letter a has already been guessed in, and found to not be in. A similar property exists for each letter of the alphabet.
		 */
		this.present = {};
		
		/**
		 * An array of the letters that have been guessed which are absent from the wordle.
		 */
		this.absent = [];
		
		this.legal_guesses = legal_guesses;
		this.legal_answers = legal_answers;
		this.guesses = [...legal_guesses];
		this.answers = [...legal_answers];
	}
	
	reset() {
		this.correct = {};
		this.present = {};
		this.absent = [];
		this.guesses = [...this.legal_guesses];
		this.answers = [...this.legal_answers];
	}

	g(guess, result) {
		// Update this.correct, present, and absent with the results.
		let guess_array = guess.split('');
		let values_array = result.split('');
		for (let i = 0; i < guess.length; i++) {
			if (values_array[i] == 'c' && !(guess_array[i] in this.correct)) {
				this.correct[guess_array[i]] = i;
			}
			else if (values_array[i] == 'a' && !(this.absent.includes(guess_array[i])) && !(guess_array[i] in this.correct)) {
				this.absent.push(guess_array[i]);
			}
			else if (values_array[i] == 'p') {
				if (guess_array[i] in this.present && !(this.present[guess_array[i]].includes(i))) {
					this.present[guess_array[i]].push(i);
				}
				else if (!(guess_array[i] in this.present)) {
					this.present[guess_array[[i]]] = [i];
				}
			}
		}

		// Filter the guesses and answers based on the above data.
		this.guesses = this.guesses.filter(this.filter.bind(this));

		// Sort the guesses and answers by some criteria.
		let letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
		let letters_count = {};
		for (const letter of letters) letters_count[letter] = 0;
		for (const word of this.guesses) {
			for (const letter of word.split('')) letters_count[letter]++;
		}
		
		let compare_words = (word1, word2) => {
			if (this.unique_letter_count(word1) != this.unique_letter_count(word2)) {
			return this.unique_letter_count(word2) - this.unique_letter_count(word1);
			}
			else {
			return this.word_value(word2, letters_count) - this.word_value(word1, letters_count);
			}
		};
		
		this.guesses.sort(compare_words.bind(this));

		return this.guesses[0];
	}

	filter(word) {
		let word_array = word.split('');
		for (const [letter, i] of Object.entries(this.correct)) {
			if (word_array[i] != letter) return false;
		}
		for (const [letter, is] of Object.entries(this.present)) {
			if (!word.includes(letter)) return false;
			for (const i of is) {
				if (word_array[i] == letter) return false;
			}
		}
		for (const letter of this.absent) {
			if (word.includes(letter)) return false;
		}
		return true;
	}
	
	unique_letter_count(word) {
		return String.prototype.concat(...new Set(word)).length;
	}
	
	word_value(word, letters_count) {
		return word.split('').reduce((result, letter) => result + letters_count[letter],0);
	}
}

fetch('https://raw.githubusercontent.com/Elekester/Playground/main/Wordle/word%20list.json')
	.then(response => response.text())
	.then(data => {
		data = JSON.parse(data);
		let guesses = data.guesses;
		let answers = data.answers;
		window.w = new Wordle(guesses, answers);
		console.log(w.g('',''));
	});
