import {NS} from "NetscriptDefinitions";
import {executeScriptOnServerFromAnother} from "./utils";

export async function main(ns: NS) {
	executeScriptOnServerFromAnother(ns, "home", "servers/home/ramcost.ts", 1, [])
}