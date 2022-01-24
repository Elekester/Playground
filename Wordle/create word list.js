function create_word_list(dictionary) {
	let word_list = dictionary.filter(word => word.length == 5);

	let letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
	let letters_count = {};
	for (const letter of letters) letters_count[letter] = 0;
	for (const word of dictionary) {
		for (const letter of word.split('')) letters_count[letter]++;
	}
	
	function word_value(word) {
		let result = 0;
		for (const letter of word.split('')) result += letters_count[letter];
		return result;
	}

	function unique_letter_count(word) {
		return String.prototype.concat(...new Set(word)).length;
	}

	function compare_words(a, b) {
		if (unique_letter_count(b) != unique_letter_count(a)) {return unique_letter_count(b) - unique_letter_count(a);}
		else {return word_value(b) - word_value(a);}
	}
	
	word_list.sort(compare_words);
	return word_list;
}
