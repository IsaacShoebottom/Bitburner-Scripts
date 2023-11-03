export async function main(ns: NS) {
	const server: string = <string> ns.args[0]
	while (true) {
		// Guide https://darktechnomancer.github.io/#glossary-of-terms
		await ns.weaken(server)
		await ns.grow(server)
		await ns.weaken(server)
		await ns.hack(server)
	}
}
