import { recursiveHackingRequired, recursiveScan } from "./utils"

export async function main(ns: NS) {
	switch (ns.args[0]) {
		case "getServers":
			getServers(ns)
			break
		case "getHackingLevels":
			getHackingLevels(ns)
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
