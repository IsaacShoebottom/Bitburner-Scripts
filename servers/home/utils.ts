// noinspection JSUnusedGlobalSymbols

/**
 * Recursively scans all servers connected to the current server, excluding home
 * @param ns global NS object
 * @returns A list of all servers connected to the current server
 */
export function recursiveScan(ns: NS) {
	// Starting case
	let servers = ns.scan("home")
	// Add all servers to the list
	let allServers: string[] = []
	while (servers.length > 0) {
		let server = servers.pop()
		if (server) {
			let newServers = ns.scan(server)
			for (const newServer of newServers) {
				if (!allServers.includes(newServer)) {
					allServers.push(newServer)
					servers.push(newServer)
				}
			}
		}
	}
	// Remove the home server from the list
	return allServers.filter(server => server !== "home").sort()
}

/**
 * Recursively scans all servers connected to the current server for the set of all levels that hackable servers require
 * @param ns
 * @returns A set of every hacking level required to hack a new server
 */
export function recursiveHackingRequired(ns: NS) {
	let servers = recursiveScan(ns)
	let levels: number[] = []
	for (let server of servers) {
		levels.push(ns.getServerRequiredHackingLevel(server))
	}
	// Sort and remove duplicates, need custom sort because built-in sort only works alphabetically 💀
	return [...new Set(levels)].sort((a, b) => a - b)
}

/**
 * Removes files passed in from all servers
 * @param ns Global NS object
 * @param files The files to remove
 * @returns void
 * @example Removes all files from the folder "no-ports" from all servers.
 * removeFilesOnAllServers(ns, ns.ls("home", "no-ports"));
 * @note ns.ls() returns the full path of every file, so if the file is not in the same place in every server,
 * you will need to modify each file path to match the server you are removing it from.
 */
export function removeFilesOnAllServers(ns: NS, files: string[]) {
	let hosts = recursiveScan(ns)
	for (const host of hosts) {
		for (const file of files) {
			ns.rm(file, host)
		}
	}
}

/**
 * Tries to gain root access to a server
 * @param ns Global NS object
 * @param server The server to gain root access to
 * @returns The number of programs used to gain root access
 */
export function rootServer(ns: NS, server: string) {
	let counter = 0
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(server)
		counter++
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(server)
		counter++
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(server)
		counter++
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(server)
		counter++
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(server)
		counter++
	}
	if (counter >= ns.getServerNumPortsRequired(server)) {
		ns.nuke(server)
	}
	return counter
}

/**
 * Performs a function on a server if the player is capable of doing so, otherwise returns false
 * @param ns Global NS object
 * @param server The server to perform the function on
 * @param func The function to perform
 * @param args The arguments to pass to the function
 * @returns The result of the function if it is performed or true if the function does not return anything, otherwise false
 */
export function performFunctionIfCapable(ns: NS, server: string, func: CallableFunction, args: any[]) {
	ns.print(`Performing function on ${server}`)
	if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server)) {
		ns.print(`Not enough hacking level to hack ${server}`)
		return false
	}
	if (ns.getServer(server).openPortCount <= ns.getServerNumPortsRequired(server)) {
		ns.print(`Not enough ports, trying to root ${server}`)
		if (rootServer(ns, server) < ns.getServerNumPortsRequired(server)) {
			ns.print(`Failed to root ${server}`)
			return false
		}
	}
	let result = func(...args)
	if (result === undefined) {
		return true
	} else {
		return result
	}
}

/**
 * Executes a script on a server from another server
 * @param ns Global NS object
 * @param server The server to execute the script on
 * @param script The file path of the script to execute
 * @param threads The number of threads to use
 * @param args The arguments to pass to the script
 */
export function executeScriptOnServerFromAnother(ns: NS, server: string, script: string, threads: number = 1, args: any[]) {
	ns.scp(script, server)
	performFunctionIfCapable(ns, server, ns.exec, [script, server, threads, ...args])
	ns.atExit(() => {
		// Remove the script from the server when the program exits
		// ns.rm(script, server)
	})
}

/**
 * Calculates the money per second the player is making
 * @param ns Global NS object
 * @param time=5 The number of seconds to calculate the MPS over
 */
export async function calculateMPS(ns: NS, time: number = 5) {
	let start = ns.getServerMoneyAvailable("home")
	let data: number[] = []
	for (let i = 0; i < time; i++) {
		await ns.sleep(1000)
		data.push(ns.getServerMoneyAvailable("home") - start)
	}
	return data.reduce((a, b) => a + b, 0) / time
}

/**
 * Type that represents a program and whether it exists on the home server
 */
export type ProgramState = {
	program: string
	exists: boolean
}

/**
 * Checks if any of the programs passed in now exist on the home server, and updates the exists property of the program
 * @param ns Global NS object
 * @param programs The programs to check
 * @returns true if any of the programs now exist, otherwise false
 */
export function checkForNewPrograms(ns: NS, programs: ProgramState[]) {
	let result = false
	for (const program of programs) {
		if (program.exists == false) {
			program.exists = ns.fileExists(program.program)
			if (program.exists) {
				result = true
			}
		}
	}
	return result
}
