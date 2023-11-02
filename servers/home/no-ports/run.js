/** @param {NS} ns */
export async function main(ns) {
	ns.run("recursive-kill.js")
	await ns.sleep(1000)
	ns.run("recursive-copy.js")
	await ns.sleep(1000)
	//home is first arg for root, hack-args is the script to run
	ns.run("recursive-run.js", 1, "root-server", "hack-args.js")

	//problem is that the scanning takes place on the same sever instead of the server that is the parent
	//need last child of each node to spawn the process on parent, as spawning on on children always needs extra ram
	//
	//root scans nodes, saves to list
	//the last execution of the exec on the last child passes in a flag to spawn on parent
	//wait for the parent to finish using sleep (maybe find better way to syncronize)
	//start hack-args function on parent
	//
	//each child becomes the "root" and repeats

	// SCRATCH ALLAT
	// its pretty much unsolveable, either way you go up or down the node tree, you end up with the problem
	// not knowing if a server will have enough ram to run the hack args script, because the end node
	// becomes circular. the only way to solve the problem would be to be able to have enough ram to call
	// spawn after the for loop after recursive-run is called for all children in the for loop.

	// so for now just will have to run a manual command for each sever with less than 8gb of ram
	// a more elegant but more set in stone solution might be to just collect every unique hostname
	// (print to console, but don't include parent, and exclude duplicates)
	// and then just run an exec on each one in a for loop

	//hack to get n00dles working, since it has low ram
	await ns.sleep(1000)
	ns.exec("hack-args.js", "n00dles", 1, "n00dles", 2.20)

	// start auto upgrade if not running
	if (!ns.isRunning("auto-upgrade.js")) {
		ns.run("auto-upgrade.js")
	}
}