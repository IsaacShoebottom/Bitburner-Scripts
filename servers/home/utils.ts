import {NS} from "NetscriptDefinitions";
export function recursiveScan(ns: NS) {
    // Starting case
	let servers = ns.scan(ns.getHostname());
    // Add all servers to the list
    let allServers: string[] = [];
    while (servers.length > 0) {
        let server = servers.shift();
        if(server) {
            let newServers = ns.scan(server);
            for (let newServer of newServers) {
                if (!allServers.includes(newServer)) {
                    allServers.push(newServer);
                    servers.push(newServer);
                }
            }
        }
    }
    // Remove the current server
    allServers.splice(allServers.indexOf(ns.getHostname()), 1);
    // Print all servers
    return allServers;
}