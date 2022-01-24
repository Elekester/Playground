/******************************************************************************
 * This program logs the comparison between two different strategies of getting PSE Bursts in PSO2:NGS.
 *
 * I want to emphasise that this code does not take everything into account. It doesn't take into account the time it takes to kill mobs and therefore doesn't take into account the timer that prevents the PSE Gauge from dropping after 5 minutes.
 ******************************************************************************
 * Copyright 2021 Clayton P. Craig
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *****************************************************************************/

/*
 * Averages the numerical output of the callback function with the given arguments over n trials.
 * @param {function} callback - The function to be averaged. Must return a number.
 * @param {number} n - The number of trials to average.
 * @param {...*} [args] - Arguments to be passed to the callback. Required if the callback has any non-optional arguments.
 */
function average_output(callback, n, ...args) {
	let average = 0;
	for (let j = 0; j < n; j++) {
		average += callback.apply(null, args);
	}
	return average/n;
}

/*
 * Creates a group of mobs.
 * @class
 * @param {number} [small_mobs=0] - The number of small mobs in the group.
 * @param {number} [big_mobs=0] - The number of big mobs in the group.
 * @param {number} [boss_mobs=0] - The number of boss mobs in the group.
 * @param {boolean} [marked=true] - If the group is marked with an E or a T.
 */
function Mob_group(small_mobs = 0, big_mobs = 0, boss_mobs = 0, marked = true) {
	this.small_mobs = small_mobs;
	this.big_mobs = big_mobs;
	this.boss_mobs = boss_mobs;
	this.marked = marked;
}

/*
 * This method kills a mob.
 * @function Mob_group#kill_mob
 * @param {number} [mob=0] - 1 if a small mob, 2 if a big mob, 3 if a boss mob. If 0 is chosen, this will kill the smallest mob possible.
 * @returns {number} 0 if nothing was killed, 1 if a small mob was killed, 2 if a big mob was killed, 3 if a boss mob was killed.
 */
Mob_group.prototype.kill_mob = function(mob = 0) {
	if ((mob == 0 || mob == 1) && this.small_mobs > 0) {this.small_mobs--; return 1;}
	else if ((mob == 0 || mob == 2) && this.big_mobs > 0) {this.big_mobs--; return 2;}
	else if ((mob == 0 || mob == 3) && this.boss_mobs > 0) {this.boss_mobs--; return 3;}
	return 0;
}

/*
 * Creates a new game state.
 * @class
 */
function State() {
	this.mobs_killed = 0;
	this.trial = false;
	this.bars = 0;
}

/*
 * This method updates the State after killing a mob.
 * @function State#roll_kill_mob
 * @param {number} killed - 0 if the killed mob is a marked enemy, 1 if the killed mob is an unmarked enemy.
 */
State.prototype.roll_kill_mob = function(killed) {
	// Roll Bars
	let roll = Math.random();
	if (killed == 0 && roll < 0.05 && this.bars > 0) {
		this.bars--;
	}
	else if (killed == 0 && roll > 0.9 && this.bars < 4) {
		this.bars++;
	}
	else if (killed == 1 && roll < 0.1 && this.bars > 0) {
		this.bars--;
	}
	else if (killed == 1 && roll > 0.9 && this.bars < 4) {
		this.bars++;
	}
	
	// Roll for a trial. Increase kill count.
	this.roll_trial();
	this.mobs_killed++;	
}

/*
 * This method randomly determines if a trial has been triggered and updates the State.
 * @function State#roll_trial
 */
State.prototype.roll_trial = function() {
	if (!this.trial && Math.random() < 0.05) {this.trial = true;}
}

/*
 * This method updates the State after finishing a trial.
 * @function State#roll_trial_finish
 */
State.prototype.roll_trial_finish = function() {
	let roll = Math.random();
	if (this.bars == 4 && roll < 0.05) {this.bars--;}
	else if (this.bars == 4 && roll > 0.95) {this.bars++;}
	this.trial = false;
}

/*
 * Simulates a game until a PSE burst is triggered using the hold trials strategy.
 * @returns {number} The number of mobs killed to trigger the PSE burst.
 */
function hold_trials() {
	let state = new State();
	while (!state.trial || state.bars < 4) {
		state.roll_kill_mob(state.trial);
	}
	return state.mobs_killed;
}

/*
 * Simulates a game until a PSE burst is triggered using the do trials strategy.
 * @returns {number} The number of mobs killed to trigger the PSE burst.
 */
function do_trials() {
	let state = new State();
	let trial_mobs = 0;
	let oldTrial = false;
	while (!state.trial || state.bars < 4) {
		state.roll_kill_mob(0);
		if (!oldTrial && state.trial) {trial_mobs += 8;}
		if (state.trial) {trial_mobs--; if (trial_mobs == 0) {state.roll_trial_finish();}}
	}
	return state.mobs_killed;
}

/*
 * Simulates games using each strategy and logs the average results.
 * @param {number} n - The number of trials to run.
 */
function main(n) {
	let hold_trials_strategy = average_output(hold_trials, n);
	let do_trials_strategy = average_output(do_trials, n);
	console.log('Average number of enemies killed before the PSE Gauge has 4 bars and there is a trial:\n  Do Trials Strategy: ' + do_trials_strategy + '\nHold Trials Strategy: ' + hold_trials_strategy);
	console.log((hold_trials_strategy < do_trials_strategy)?'The Hold Trials Strategy is better.':'The Do Trials Strategy is better.');
}

main(100)
