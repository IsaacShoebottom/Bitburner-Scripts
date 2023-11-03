import {NS} from "NetscriptDefinitions";
export async function main(ns: NS) {
	const server: string = <string>ns.args[0];
	while (true) {
		/* This code checks conditions that are not needed with smart scheduling
		const moneyThresh: number = <number>ns.args[1];
		const securityThresh: number = <number>ns.args[2];
		if (ns.getServerSecurityLevel(server) > securityThresh) {
			await ns.weaken(server);
		} else if (ns.getServerMoneyAvailable(server) < moneyThresh) {
			await ns.grow(server);
		} else {
			await ns.hack(server);
		}
		 */

		// Guide
		// https://darktechnomancer.github.io/#glossary-of-terms
		await ns.weaken(server);
		await ns.grow(server);
		await ns.weaken(server);
		await ns.hack(server);
	}
}