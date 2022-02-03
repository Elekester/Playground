// This wordle solver doesn't quite handle double letters properly, and might be overvaluing guesses with them because of that.
// Its also really slow, implement ab pruning.

class Wordle_solver {
	constructor(hard_mode = false, correct = [null, null, null, null, null]
		, present = [[], [], [], [], []], absent= [], answers = null, guesses = null
		, defaults = true) {
		if (answers && guesses) {
			this.answers = [...answers];
			this.guesses = [...guesses];
			if (defaults) {
				this.wordleAnswers = [...answers];
				this.wordleGuesses = [...guesses];
			}
		} else {
			fetch('https://raw.githubusercontent.com/Elekester/Playground/main/Wordle/word%20list.json')
				.then(response => response.text())
				.then(data => {
				data = JSON.parse(data);
				answers = answers || data.answers;
				guesses = guesses || data.guesses;
				this.answers = [...answers];
				this.guesses = [...guesses];
				if (defaults) {
					this.wordleAnswers = [...answers];
					this.wordleGuesses = [...guesses];
				}
			});
		}
		this.correct = [...correct];
		this.present = [];
		for (let i = 0; i < 5; ++i) {
			this.present[i] = [...present[i]];
		}
		this.absent = [...absent];
		this.hard_mode = hard_mode;
		if (defaults) {
			this.wordleCorrect = [...correct];
			this.wordlePresent = [];
			for (let i = 0; i < 5; ++i) {
				this.wordlePresent[i] = [...present[i]];
			}
			this.wordleAbsent = [...absent];
		}
	}
	
	filter(what) {
		this[what] = this[what].filter(word => {
			if ([...word].some(l => this.absent.indexOf(l) >= 0)) return false;
			for (let i = 0; i < 5; ++i) {
				if ((this.correct[i] && word[i] != this.correct[i]) || (this.present[i].includes(word[i]))) return false;
			}
			let present_letters = [].concat(...this.present);
			for (const letter of present_letters) {
				if (![...word].includes(letter)) return false;
			}
			return true;
		});
	}
	
	restart(defaults = true) {
		if (defaults) {
			this.correct = [...this.wordleCorrect];
			this.present = [];
			for (let i = 0; i < 5; ++i) {
				this.present[i] = [...this.wordlePresent[i]];
			}
			this.absent = [...this.wordleAbsent];
			this.answers = [...this.wordleAnswers];
			this.guesses = [...this.wordleGuesses];
			return true;
		} else return false;
	}
	
	static results(guess, answer) {
		let results = [];
		for (let i = 0; i < 5; ++i) {
			if (guess[i] == answer[i]) {results[i] = 'c'}
			else if (answer.includes(guess[i])) {results[i] = 'p'}
			else {results[i] = 'a'}
		}
		return results.join('');
	}
	
	score(depth = 0) {
		if (depth === 0 || this.answers.length === 1) return this.answers.length;
		else {
			let a = Infinity;
			let value = 0;
			let temp_wordle = new Wordle_solver(this.hard_mode, this.correct, this.present, this.absent, this.answers, this.guesses, true);
			for (const guess of this.guesses) {
				value = 0;
				for (const answer of this.answers) {
					temp_wordle.restart();
					temp_wordle.update(guess, Wordle_solver.results(guess, answer));
					value += temp_wordle.score(depth - 1);
				}
				a = Math.min(a, value);
			}
			a /= this.answers.length;
			return a;
		}
	}
	
	solve(depth = 1) {
		let dict = {};
		let value = 0;
		let temp_wordle = new Wordle_solver(this.hard_mode, this.correct, this.present, this.absent, this.answers, this.guesses, true);
		for (const guess of this.guesses) {
			value = 0;
			for (const answer of this.answers) {
				temp_wordle.restart();
				temp_wordle.update(guess, Wordle_solver.results(guess, answer));
				value += temp_wordle.score(depth - 1);
			}
			dict[guess] = value;
		}
		this.guesses.sort((a,b) => dict[b] - dict[a]);
		return this.guesses;
	}
	
	update(guess, results) {
		for (let i = 0; i < guess.length; ++i) {
			if (results[i] == 'c' && !this.correct[i]) {
				this.correct[i] = guess[i];
			} else if (results[i] == 'p' && !this.present[i].includes(guess[i])) {
				this.present[i].push(guess[i]);
			} else if (results[i] == 'a' && !this.absent.includes(guess[i]) && !this.correct.includes(guess[i]) && ![].concat(...this.present).includes(guess[i])) {
				this.absent.push(guess[i]);
			}
		}
		this.filter('answers');
		if (this.hard_mode) this.filter('guesses');
	}
}

w = new Wordle_solver(true);
