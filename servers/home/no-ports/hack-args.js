/** @param {NS} ns */
export async function main(ns) {
	let hostname = ns.args[0]
	let cost = ns.args[1]
	let moneyThresh = ns.getServerMaxMoney(hostname) * 0.75;
	let securityThresh = ns.getServerMinSecurityLevel(hostname) + 5;

	let numThreads = ns.getServerMaxRam(hostname) / cost
	numThreads = Math.floor(numThreads)

	if (numThreads < 1 || numThreads == Infinity) {
		numThreads = 1
	}
	ns.spawn("hack.js", numThreads, hostname, moneyThresh, securityThresh)
}