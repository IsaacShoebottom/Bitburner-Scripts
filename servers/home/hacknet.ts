/*
 * TODO:
 *  The current solution is not optimal, as it's preferable to buy new nodes, even if upgrading is cheaper.
 * TODO:
 *  It may be helpful to calculate the money per second of each node on average, (total mps / total nodes) and compare
 *  it to the time it would take to purchase the next cheapest upgrade, and if the average mps is greater than the
 *  negative mps of the upgrade cost, then buy a new node.
 * TODO:
 *  Potential Ideas:
 *   Find a way to calculate how much mps an individual upgrade would give, and compare it to the average mps of the node.
 *   ns.hacknet.getNodeStats(0).production
 *   If the upgrade mps is greater than the average mps, then buy the upgrade.
 *   If the upgrade mps is less than the average mps, then buy a new node.
 */

enum UpgradeType {
	level = "level", ram = "ram", core = "code",
}

export async function main(ns: NS) {
	let timeout: number = <number> ns.args[0]

	let nodes = ns.hacknet.numNodes()
	// If there are no nodes, buyUpgrade one
	if (nodes === 0) {
		ns.hacknet.purchaseNode()
		nodes = 1
	}

	let costs: { type: UpgradeType, cost: number }[] = []
	while (true) {
		costs = []
		// Go through each node and get the cheapest upgrade
		for (let i = 0; i < nodes; i++) {
			costs.push(getCheapestCost(ns, i))
		}
		// Get the cheapest upgrade object
		let cheapest = costs.reduce((prev, curr) => prev.cost < curr.cost ? prev : curr)

		// Nodes have a lot more value, so only need node price to be 1/10th the cost of the cheapest upgrade
		if (ns.hacknet.getPurchaseNodeCost() / 10 < cheapest.cost) {
			await buyNode(ns, ns.hacknet.getPurchaseNodeCost(), timeout)
		} else {
			await buyUpgrade(ns, cheapest.type, cheapest.cost, costs.indexOf(cheapest), timeout)
		}
		// Make sure that the number of nodes is up-to-date
		nodes = ns.hacknet.numNodes()
	}
}

/**
 * Wait until the player has enough money to buyUpgrade something
 * @param ns Global NS object
 * @param money Amount of money to wait for
 * @param timeout=-1 Number of seconds to wait before timing out.
 * @throws Error if the timeout is reached
 * @note This function will wait forever by default
 */
async function waitUntilMoney(ns: NS, money: number, timeout: number = -1) {
	while (ns.getServerMoneyAvailable("home") < money) {
		await ns.sleep(1000)
		if (timeout == 0) {
			throw new Error("Timed out waiting for money")
		} else if (timeout > -1) {
			timeout--
		}
	}
}

async function buyUpgrade(ns: NS, type: UpgradeType, cost: number, node: number, timeout: number) {
	await waitUntilMoney(ns, cost, timeout)
	switch (type) {
		case UpgradeType.level:
			ns.hacknet.upgradeLevel(node)
			break
		case UpgradeType.ram:
			ns.hacknet.upgradeRam(node)
			break
		case UpgradeType.core:
			ns.hacknet.upgradeCore(node)
			break
	}
}

async function buyNode(ns: NS, cost: number, timeout: number) {
	await waitUntilMoney(ns, cost, timeout)
	ns.hacknet.purchaseNode()
}

function getCheapestCost(ns: NS, node: number) {
	let levelCost = ns.hacknet.getLevelUpgradeCost(node)
	let ramCost = ns.hacknet.getRamUpgradeCost(node)
	let coreCost = ns.hacknet.getCoreUpgradeCost(node)
	let cheapest = Math.min(levelCost, ramCost, coreCost)
	switch (cheapest) {
		case levelCost:
			return { type: UpgradeType.level, cost: levelCost }
		case ramCost:
			return { type: UpgradeType.ram, cost: ramCost }
		case coreCost:
			return { type: UpgradeType.core, cost: coreCost }
	}
}
