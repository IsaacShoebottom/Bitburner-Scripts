import {NS} from "NetscriptDefinitions";
export async function main(ns: NS) {
	const server: string = <string>ns.args[0];
	const moneyThresh: number = <number>ns.args[1];
	const securityThresh: number = <number>ns.args[2];
	while (true) {
		if (ns.getServerSecurityLevel(server) > securityThresh) {
			await ns.weaken(server);
		} else if (ns.getServerMoneyAvailable(server) < moneyThresh) {
			await ns.grow(server);
		} else {
			await ns.hack(server);
		}
	}
}