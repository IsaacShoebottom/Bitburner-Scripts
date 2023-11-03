import {NS} from "NetscriptDefinitions";
import {recursiveScan} from "./utils";

export async function main(ns: NS) {
	let servers: string[] = recursiveScan(ns)
	for (const server of servers) {
		ns.killall(server)
	}
}