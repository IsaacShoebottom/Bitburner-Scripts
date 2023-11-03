import {NS} from "NetscriptDefinitions";
import {recursiveScan} from "./utils";

export async function main(ns: NS, servers: string[]) {
    let hosts = recursiveScan(ns);

    let folderPrefix = "no-ports/";
    let files = ns.ls("home", folderPrefix).map((file) => {
        return file.substring(folderPrefix.length, file.length);
    });

    ns.tprint("Files to be removed: ", JSON.stringify(files));

    for(const host of hosts) {
       for (const file of files) {
           ns.rm(file, host)
       }
    }
}