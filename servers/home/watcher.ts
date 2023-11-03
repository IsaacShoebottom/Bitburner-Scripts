export async function main(ns: NS) {
	let hackingLevel = ns.getHackingLevel();
	while (hackingLevel < 9999) {
		let oldHackingLevel = hackingLevel;
		hackingLevel = ns.getHackingLevel();
		if(oldHackingLevel !== hackingLevel) {
			ns.tprint(`Hacking level increased from ${oldHackingLevel} to ${hackingLevel}`);
			ns.run("killall.js");
			await ns.sleep(1000) // 1 second
			ns.run("hackallservers.js");
		}
		// Wait 1 second before checking again
		await ns.sleep(1000)
	}
}