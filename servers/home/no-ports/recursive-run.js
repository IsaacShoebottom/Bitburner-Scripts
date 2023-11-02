/** @param {NS} ns */
export async function main(ns) {
	let parent = ns.args[0]
	let script = ns.args[1]
	let selfScript = "recursive-run.js"
	let servers = ns.scan()
	//ns.tprint("INFO Scan of ", ns.getHostname(), ": ", servers)

	for (const server of servers) {
		if (server === parent) {
			continue;
		}
		ns.exec(selfScript, server, 1, ns.getHostname(), script)
		await ns.sleep(50)

		let procs = ns.ps(server)
		if (procs.length > 0) {
			//ns.tprint("INFO Ram in use on ", server, ": ", ns.getServerUsedRam(server))
			let ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
			//ns.tprint("INFO Available ram on ", server, ": ", ram)
			//ns.tprint("INFO Filename of running script: ", procs[0].filename)
		}

		if (ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel()) {
			// after thread args, first arg is the server it us running on, and then the cost of the hack script
			ns.tprint("RUN Started hacking server: ", server)
			ns.exec(script, server, 1, server, ns.getScriptRam("hack.js", server))
		}
	}
}