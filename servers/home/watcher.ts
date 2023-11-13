import { recursiveHackingRequired } from "./utils"

export async function main(ns: NS) {
	let levels = recursiveHackingRequired(ns)
	let hackingLevel = ns.getHackingLevel()
	// Remove levels that are already hacked
	levels = levels.filter(level => level > hackingLevel)

	do {
		if (Math.min(...levels) <= hackingLevel) {
			// remove the level from the list, so we don't try to hack it again
			levels = levels.filter(level => level > hackingLevel)
			ns.tprint(`Hacking level increased past ${Math.min(...levels)}}, is now ${hackingLevel}`)
			ns.tprint(`Remaining levels to hack: ${levels}`)
			ns.run("killall.js")
			await ns.sleep(1000) // 1 second
			ns.run("hackallservers.js")
		}
		hackingLevel = ns.getHackingLevel()
		// Wait 1 second before checking again
		await ns.sleep(1000)
	} while (hackingLevel <= Math.max(...levels))
}
