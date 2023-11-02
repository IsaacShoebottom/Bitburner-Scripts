/** @param {NS} ns */
export async function main(ns) {
    let files = [
        "run-script-on-all-servers.js",
        "recursive-run.js",
        "recursive-copy.js",
        "recursive-kill.js",
        "hack-args.js",
        "hack.js",
        "root.js",
        "recursive-root.js"
    ]
    let hosts = [
        "zb-institute",
        "comptek",
        "nectar-net",
        "neo-net",
        "max-hardware",
        "omega-net",
        "avmnite-02h",
        "CSEC"
    ]

    for(const host of hosts) {
        for (const file of files) {
            ns.rm(file, host)
        }
    }
}