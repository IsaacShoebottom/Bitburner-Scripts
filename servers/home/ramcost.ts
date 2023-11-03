import {NS} from "NetscriptDefinitions";
import {executeScriptOnServerFromAnother} from "./utils";

export async function main(ns: NS) {
	executeScriptOnServerFromAnother(ns, "servers/home/ramcost.ts", [], "home")
}