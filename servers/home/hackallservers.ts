import { executeScriptOnServerFromAnother, recursiveScan } from "./utils"

export async function main(ns: NS) {
	let servers: string[] = recursiveScan(ns)

	for (const server of servers) {
		let numThreads = ns.getServerMaxRam(server) / ns.getScriptRam("hack.js")
		numThreads = Math.floor(numThreads)
		executeScriptOnServerFromAnother(ns, server, "hack.js", numThreads, [server])
	}
}
