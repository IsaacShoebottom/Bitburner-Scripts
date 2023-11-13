import { executeScriptOnServerFromAnother, recursiveScan } from "./utils"

export async function main(ns: NS) {
	let servers: string[] = recursiveScan(ns)

	for (const server of servers) {
		// Guard clause for story servers, but hacking xp is nice. Can probably be enabled when XP is easy to get
		// if (ns.getServerMaxMoney(server) === 0) { continue }

		let numThreads = ns.getServerMaxRam(server) / ns.getScriptRam("hack.js")
		numThreads = Math.floor(numThreads)
		numThreads = Math.max(numThreads, 1) // Make sure we have at least 1 thread
		executeScriptOnServerFromAnother(ns, server, "hack.js", numThreads, [server])
	}
}
