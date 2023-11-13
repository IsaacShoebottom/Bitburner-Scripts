import { checkForNewPrograms, ProgramState, recursiveHackingRequired } from "./utils"

export async function main(ns: NS) {
	let levels = recursiveHackingRequired(ns)
	let hackingLevel = ns.getHackingLevel()

	let state: ProgramState[] = [
		{ program: "BruteSSH.exe", exists: false },
		{ program: "FTPCrack.exe", exists: false },
		{ program: "relaySMTP.exe", exists: false },
		{ program: "HTTPWorm.exe", exists: false },
		{ program: "SQLInject.exe", exists: false },
	]
	checkForNewPrograms(ns, state)

	// Remove levels that are already hacked
	levels = levels.filter(level => level > hackingLevel)

	do {
		let restart = false
		if (Math.min(...levels) <= hackingLevel) {
			ns.tprint(`Hacking level increased past ${Math.min(...levels)}}, is now ${hackingLevel}`)
			ns.tprint(`Remaining levels to hack: ${levels}`)
			// remove the level from the list, so we don't try to hack it again
			levels = levels.filter(level => level > hackingLevel)
			restart = true
		}
		if (checkForNewPrograms(ns, state)) {
			ns.tprint(`New programs found: ${state.filter(program => program.exists).map(program => program.program)}`)
			restart = true
		}
		if (restart) {
			ns.run("killall.js")
			await ns.sleep(1000) // 1 second
			ns.run("hackallservers.js")
		}
		hackingLevel = ns.getHackingLevel()
		// Wait 1 second before checking again
		await ns.sleep(1000)
	} while (hackingLevel <= Math.max(...levels))
}
