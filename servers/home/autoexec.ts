export async function main(ns: NS) {
	ns.run("hackallservers.js")
	ns.run("watcher.js")
	ns.run("hacknet.js")
}
