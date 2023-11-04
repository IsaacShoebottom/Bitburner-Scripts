import { recursiveHackingRequired } from "./utils"

export async function main(ns: NS) {
	let levels = recursiveHackingRequired(ns)
	let hackingLevel: number
	do {
		hackingLevel = ns.getHackingLevel()
		if (levels.includes(hackingLevel)) {
			// remove the level from the list, so we don't try to hack it again
			levels.splice(levels.indexOf(hackingLevel), 1)
			ns.tprint(`Hacking level increased to ${hackingLevel}`)
			ns.run("killall.js")
			await ns.sleep(1000) // 1 second
			ns.run("hackallservers.js")
		}
		// Wait 1 second before checking again
		await ns.sleep(1000)
	} while (hackingLevel <= Math.max(...levels))
}
