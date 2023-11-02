/** @param {NS} ns */
export async function main(ns) {
	let level = ns.getHackingLevel()

	while (level < 999) {
		let newLevel = ns.getHackingLevel()
		if (newLevel !== level) {
			ns.run("run.js")
		}
		level = newLevel
		await ns.sleep(10 * 1000) // 10 seconds
	}
}