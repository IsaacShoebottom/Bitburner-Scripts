import { recursiveHackingRequired, recursiveScan, removeFilesOnAllServers } from "./utils"

export async function main(ns: NS) {
	switch (ns.args[0]) {
		case "getServers":
			getServers(ns)
			break
		case "getHackingLevels":
			getHackingLevels(ns)
			break
		case "removeFiles":
			removeFilesOnAllServersFromArgs(ns)
			break
		default:
			ns.tprint("Invalid program name")
			break
	}
}

function getServers(ns: NS) {
	ns.tprint(recursiveScan(ns))
}

function getHackingLevels(ns: NS) {
	ns.tprint(recursiveHackingRequired(ns))
}

function removeFilesOnAllServersFromArgs(ns: NS) {
	let args = ns.args.slice(1)
	let files = args.map((file) => file.toString())
	removeFilesOnAllServers(ns, files)
}
