// noinspection JSUnusedGlobalSymbols

import {NS} from "NetscriptDefinitions";

/**
 * Recursively scans all servers connected to the current server, excluding home
 * @param ns global NS object
 * @returns A list of all servers connected to the current server
 */
export function recursiveScan(ns: NS) {
    // Starting case
	let servers = ns.scan("home");
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
    allServers.splice(allServers.indexOf("home"), 1);
    // Print all servers
    return allServers;
}

/**
 * Removes files passed in from all servers
 * @param ns Global NS object
 * @param files The files to remove
 * @returns void
 * @example Removes all files from the folder "no-ports" from all servers.
 * removeFilesOnAllServers(ns, ns.ls("home", "no-ports"));
 * @note ns.ls() returns the full path of every file, so if the file is not in the same place in every server,
 * you will need to modify each file path to match the server you are removing it from.
 */
export function removeFilesOnAllServers(ns: NS, files: string[]) {
    let hosts = recursiveScan(ns);
    for(const host of hosts) {
        for (const file of files) {
            ns.rm(file, host)
        }
    }
}

/**
 * Tries to gain root access to a server
 * @param ns Global NS object
 * @param server The server to gain root access to
 * @returns The number of programs used to gain root access
 */
export function rootServer(ns: NS, server: string) {
    let counter = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        counter++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        counter++;
    }
    if (ns.fileExists("SMTPCrack.exe", "home")) {
        ns.relaysmtp(server);
        counter++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(server);
        counter++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(server);
        counter++;
    }
    ns.nuke(server)
    return counter;
}

/**
 * Performs a function on a server if the player is capable of doing so, otherwise returns false
 * @param ns Global NS object
 * @param server The server to perform the function on
 * @param func The function to perform
 * @param args The arguments to pass to the function
 * @returns The result of the function if it is performed or true if the function does not return anything, otherwise false
 */
export function performFunctionIfCapable(ns: NS, server: string, func: CallableFunction, args: any[]) {
    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server)) {
        return false;
    }
    if (ns.getServerNumPortsRequired(server) < ns.getServer(server).openPortCount) {
        if (rootServer(ns, server) < ns.getServerNumPortsRequired(server)) {
            return false;
        }
    }
    if (!ns.hasRootAccess(server)) {
        return false;

    }
    let result = func(...args);
    if (result === undefined) {
        return true;
    } else {
        return result;
    }
}