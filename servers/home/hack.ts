export async function main(ns: NS) {
	const server: string = <string> ns.args[0]
	while (true) {
		// Guide https://darktechnomancer.github.io/#glossary-of-terms

		if (ns.getServerSecurityLevel(server) > 5) {
			await ns.weaken(server)
		} else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server) * 0.95) {
			await ns.grow(server)
		} else {
			await ns.hack(server)
		}
	}
}
