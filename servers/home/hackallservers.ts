import {NS} from "NetscriptDefinitions";
import {recursiveScan} from "./utils";
import {executeScriptOnServerFromAnother} from "./utils";

export async function main(ns: NS) {
	let servers: string[] = recursiveScan(ns);

	for (const server of servers) {
		let moneyThresh = ns.getServerMaxMoney(server) * 0.75;
		let securityThresh = ns.getServerMinSecurityLevel(server) + 5;
		let numThreads = ns.getServerMaxRam(server) / ns.getScriptRam("hack.js")
		numThreads = Math.floor(numThreads);
		executeScriptOnServerFromAnother(ns, server, "hack.js", numThreads, [server, moneyThresh, securityThresh])
	}
}