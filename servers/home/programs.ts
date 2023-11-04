import { recursiveScan } from "./utils"

export async function main(ns: NS){
	switch (ns.args[0]) {
		case "getServers":
			getServers(ns);
			break;
		default:
			ns.tprint("Invalid program name");
			break;
	}
}
function getServers(ns: NS) {
	ns.tprint(recursiveScan(ns));
}
