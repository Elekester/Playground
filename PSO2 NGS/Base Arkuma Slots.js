class Arkuma {
	constructor(stage = 1, b = false, p = false, y = false, sets = 0, cc = 0) {
		this.stage = stage;
		this.b = b;
		this.p = p;
		this.y = y;
		this.sets = sets;
		this.cc = cc;
		this.terminal = false;
	}
	
	spin() {
		if ((this.cc == 0 && this.stage != 1) || this.stage > 30) {this.terminal = true; return this.cc}
		let cutoffs = [0,100,0];
		switch (Math.floor((this.stage-1)/5)) {
			case 0:
				cutoffs = [0,36,69];
				break;
			case 1:
				cutoffs = [16,43,73];
				break;
			case 2:
				cutoffs = [23,55,89];
				break;
			case 3:
				cutoffs = [29,57,92];
				break;
			case 4:
				cutoffs = [38,64,90];
				break;
			case 5:
				cutoffs = [46,64,91];
				break;
		}
		let roll = Math.random()*100;
		if (roll < cutoffs[0]) {this.boss()}
		else if (roll < cutoffs[1]) {this.b = true; this.cc += 10}
		else if (roll < cutoffs[2]) {this.p = true; this.cc += 30}
		else {this.y = true; this.cc += 50}
		if (this.b && this.p && this.y) {
			switch (this.sets) {
				case 0:
					this.cc += 100;
					this.sets = 1;
					break;
				case 1:
					this.cc += 300;
					this.sets = 2;
					break;
				default:
					this.cc += 500;
					break;
			}
			this.b = false;
			this.p = false;
			this.y = false;
		}
		this.stage++;
		return this.cc;
	}
	
	boss(num) {
		if (num) {
			let roll2 = Math.random()*100;
			if (num == 4) {
				if (roll2 < 25) {this.cc *= 0}
				else if (roll2 < 50) {this.cc *= 1.2}
				else if (roll2 < 75) {this.cc *= 1.3}
				else {this.cc *= 1.4}
			} else if (num == 3) {
				if (roll2 < 1/3*100) {this.cc *= 0}
				if (roll2 < 2/3*100) {this.cc *= 1.3}
				else {this.cc *= 1.5}
			} else {
				if (roll2 < 50) {this.cc *= 0}
				else {this.cc *= 1.8}
			}
			return;
		}
		let cutoffs = [0,100];
		switch (Math.floor((this.stage-1)/5)) {
			case 0:
				return;
				break;
			case 1:
				cutoffs = [79,100];
				break;
			case 2:
				cutoffs = [38,89];
				break;
			case 3:
				cutoffs = [10,74];
				break;
			case 4:
				cutoffs = [0,31];
				break;
			case 5:
				cutoffs = [0,0];
				break;
		}
		let roll = Math.random()*100;
		let roll2 = Math.random()*100;
		if (roll < cutoffs[0]) {
			if (roll2 < 25) {this.cc *= 0}
			else if (roll2 < 50) {this.cc *= 1.2}
			else if (roll2 < 75) {this.cc *= 1.3}
			else {this.cc *= 1.4}
		} else if (roll < cutoffs[1]) {
			if (roll2 < 1/3*100) {this.cc *= 0}
			if (roll2 < 2/3*100) {this.cc *= 1.3}
			else {this.cc *= 1.5}
		} else {
			if (roll2 < 50) {this.cc *= 0}
			else {this.cc *= 1.8}
		}
	}
	
	copy() {
		return new this.constructor(this.stage, this.b, this.p, this.y, this.sets, this.cc);
	}
	
	spun(roll) {
		if (roll == 'b') {this.b = true; this.cc += 10}
		else if (roll == 'p') {this.p = true; this.cc += 30}
		else if (roll == 'y') {this.y = true; this.cc += 50}
		else if (roll == 'd2' || roll == 'd3' || roll == 'd4') {
			let avg = 0;
			for (let i = 0; i < this.constructor.iterations; i++) {
				let game = this.copy();
				game.boss(roll.slice(1));
				game.stage++;
				while (!game.terminal) {game.spin()}
				avg += game.cc;
			}
			avg /= this.constructor.iterations;
			console.log(avg, this.cc, this);
			return;
		} else {
			this.cc *= roll/100;
		}
		if (this.b && this.p && this.y) {
			switch (this.sets) {
				case 0:
					this.cc += 100;
					this.sets = 1;
					break;
				case 1:
					this.cc += 300;
					this.sets = 2;
					break;
				default:
					this.cc += 500;
					break;
			}
			this.b = false;
			this.p = false;
			this.y = false;
		}
		this.stage++;
		let avg = 0;
		for (let i = 0; i < this.constructor.iterations; i++) {
			let game = this.copy();
			while (!game.terminal) {game.spin()}
			avg += game.cc;
		}
		avg /= this.constructor.iterations;
		console.log(avg, this.cc, this);
		return;
	}
	
	static iterations = 1000000;
}

let a = new Arkuma();
for (let i = 0; i < 5; i++) {a.spin()}
console.log(a);
