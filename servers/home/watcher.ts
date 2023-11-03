import {NS} from "NetscriptDefinitions";
export async function main(ns: NS) {
	let hackingLevel = ns.getHackingLevel();
	while (hackingLevel < 9999) {
		ns.run("hackallservers.js");
		let seconds = 60 * 1000; // 1 minute
		await ns.sleep(seconds)

		let oldHackingLevel = hackingLevel;
		hackingLevel = ns.getHackingLevel();
		if(oldHackingLevel !== hackingLevel) {
			ns.tprint(`Hacking level increased from ${oldHackingLevel} to ${hackingLevel}`);
			ns.run("killall.js");
			await ns.sleep(1000) // 1 second
			ns.run("hackallservers.js");
		}
	}
}