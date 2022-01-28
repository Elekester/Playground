/**
 * Represents a group of coins.
 */
class Coins {
	/**
	 * Constructs an instance of Coins.
	 * @param {number} [cp=0] - The quantity of copper pieces.
	 * @param {number} [sp=0] - The quantity of silver pieces.
	 * @param {number} [ep=0] - The quantity of electrum pieces.
	 * @param {number} [gp=0] - The quantity of gold pieces.
	 * @param {number} [pp=0] - The quantity of platinum pieces.
	 */
	constructor(cp = 0, sp = 0, ep = 0, gp = 0, pp = 0) {
		/**
		 * The quantity of copper pieces.
		 * @type {number}
		 */
		this.cp = cp;
		
		/**
		 * The quantity of silver pieces.
		 * @type {number}
		 */
		this.sp = sp;
		
		/**
		 * The quantity of electrum pieces.
		 * @type {number}
		 */
		this.ep = ep;
		
		/**
		 * The quantity of gold pieces.
		 * @type {number}
		 */
		this.gp = gp;
		
		/**
		 * The quantity of platinum pieces.
		 * @type {number}
		 */
		this.pp = pp;
	}
	
	/**
	 * Adds a number of coins of the given type equal to the given value to the instance. Can also add a Coins instance.
	 * @param {string} type 'cp', 'sp', 'ep', 'gp', 'pp', or 'coins'.
	 * @param {number|Coins} value The number of coins to add or the Coins instance to combine.
	 * @returns {boolean} True if succesful, false if not.
	 */
	add(type, value) {
		let result = false;
		switch (type) {
			case 'cp':
			case 'sp':
			case 'ep':
			case 'gp':
			case 'pp':
				this[type] += value;
				result = true;
				break;
			case 'coins':
				this.cp += value.cp;
				this.sp += value.sp;
				this.ep += value.ep;
				this.gp += value.gp;
				this.pp += value.pp;
				result = true;
				break;
		}
		return result;
	}
	
	/**
	 * The total value of the coins.
	 * @returns {number} The value, in gold pieces, of the coins.
	 */
	value() {
		return this.cp/100 + this.sp/10 + this.ep/2 + this.gp + this.pp*10;
	}
	
	/**
	 * Loads a Coins instance from the data.
	 * @param {string|Object} data Either a json string or an Object with the properties of a Coins instance.
	 * @returns {Coins} The Coins instance.
	 */
	static load(data) {
		let instance = new Coins();
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}
		for (const [key, value] of Object.entries(data)) {
			instance[key] = value;
		}
		return instance;
	}
	
	/**
	 * Returns the Coins instance as a json string.
	 * @param {Coins} instance The instance to jsonify.
	 * @returns {string} The instance as a json string.
	 */
	static save(instance) {
		return JSON.stringify(instance);
	}
}

/**
 * Represents an item.
 */
class Item {
	/**
	 * Constructs an instance of Item.
	 * @param {number} [value=0] The value of the item in gold pieces.
	 * @param {string} [desc=''] The description of the item.
	 */
	constructor(value = 0, desc = '') {
		this.value = value;
		this.desc = desc;
	}
	
	/**
	 * Loads an Item instance from the data.
	 * @param {string|Object} data Either a json string or an Object with the properties of a Item instance.
	 * @returns {Item} The Item instance.
	 */
	static load(data) {
		let instance = new Item();
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}
		for (const [key, value] of Object.entries(data)) {
			instance[key] = value;
		}
		return instance;
	}
	
	/**
	 * Returns the Item instance as a json string.
	 * @param {Item} instance The instance to jsonify.
	 * @returns {string} The instance as a json string.
	 */
	static save(instance) {
		return JSON.stringify(instance);
	}
}

/**
 * Represents a bag of coins and items.
 */
class Bag {
	/**
	 * Constructs an instance of Bag.
	 * @param {Coins} [coins=new Coins()] A Coins instance to put in the bag.
	 * @param {[Items]} [items=[]] An array of Item instances to put in the bag.
	 */
	constructor(coins = new Coins(), items = []) {
		this.coins = coins;
		this.items = items;
	}
	
	/**
	 * Adds a number of coins of the given type equal to the given value to the instance. Can also add a Coins, Item, or Bag instance.
	 * @param {string} type 'cp', 'sp', 'ep', 'gp', 'pp', 'coins', 'item', 'bag'.
	 * @param {number|Coins|Item|Bag} value The number of coins to add or the instance to combine.
	 * @returns {boolean} True if succesful, false if not.
	 */
	add(type, value) {
		let result = false;
		switch (type) {
			case 'cp':
			case 'sp':
			case 'ep':
			case 'gp':
			case 'pp':
				this.coins.add(type, value);
				result = true;
				break;
			case 'coins':
				this.coins.add('coins', value);
				result = true;
				break;
			case 'item':
				this.items.push(value);
				result = true;
				break;
			case 'bag':
				this.coins.add('coins', value.coins);
				this.items = this.items.concat(value.items);
				result = true;
				break;
		}
		return result;
	}
	
	/**
	 * The total value of the contents of the bag.
	 * @returns {number} The value, in gold pieces, of the contents of the bag.
	 */
	value() {
		let result = this.coins.value();
		for (const item of this.items) {
			result += item.value;
		}
		return result;
	}
	
	/**
	 * Loads a Bag instance from the data.
	 * @param {string|Object} data Either a json string or an Object with the properties of a Bag instance.
	 * @returns {Item} The Bag instance.
	 */
	static load(data) {
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}
		let instance = new Bag(Coins.load(data.coins));
		for (const item of data.items) {
			instance.add('item', Item.load(item));
		}
		delete data.coins;
		delete data.items;
		return instance;
	}
	
	/**
	 * Returns the Bag instance as a json string.
	 * @param {Item} instance The instance to jsonify.
	 * @returns {string} The instance as a json string.
	 */
	static save(instance) {
		return JSON.stringify(instance);
	}
}

// Example
let bag_example = new Bag(new Coins(31, 17, 0, 2), [new Item(42, 'Thing 1')]);
bag_example.add('item', new Item(37, 'Thing 2'));
