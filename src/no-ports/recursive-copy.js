/** @param {NS} ns */
export async function main(ns) {
	let parent
	if (ns.args[0] == undefined) {
		parent = "home"
	} else {
		parent = ns.args[0]
	}

	let files = [
		"hack-args.js",
		"hack.js",
		"root.js",
		"recursive-copy.js",
		"recursive-kill.js",
		"recursive-run.js"
	]
	let script = "recursive-copy.js"
	let servers = ns.scan()

	for (const server of servers) {
		if (server == parent) {
			continue
		}
		if (server == "home") {
			continue
		}
		//ns.tprint("Copied to: :", server)
		ns.scp(files, server, "home")

		ns.exec(script, server, 1, ns.getHostname()) // script, dest, thread count, arg1
	}
}