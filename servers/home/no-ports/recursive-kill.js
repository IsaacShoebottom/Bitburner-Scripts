/** @param {NS} ns */
export async function main(ns) {
	let parent
	if (ns.args[0] == undefined) {
		parent = "home"
	} else {
		parent = ns.args[0]
	}
	let script = "recursive-kill.js"

	let servers = ns.scan()

	for (const server of servers) {
		if (server == parent) {
			continue
		}
		if (!ns.hasRootAccess(server)) {
			ns.exec("root.js", ns.getHostname(), 1, server)
		}

		//ns.tprint("Killed all scripts on: ", server)
		ns.killall(server, true)

		ns.exec(script, server, 1, ns.getHostname())
	}
}