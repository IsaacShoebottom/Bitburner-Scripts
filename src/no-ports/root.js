/** @param {NS} ns */
export async function main(ns) {
	let server = ns.args[0]
	if (ns.getServerNumPortsRequired(server) <= 2) {
		ns.brutessh(server)
		ns.ftpcrack(server)
		ns.nuke(server)
	}
}