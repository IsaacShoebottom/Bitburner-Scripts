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

enum Type {
	newNode = 'node', level = 'level', ram = 'ram', core = 'code',
}

export async function main(ns: NS) {
	let timeout: number = <number> ns.args[0]

	let nodes = ns.hacknet.numNodes()
	let costs: { type: Type, cost: number }[] = []
	while (true) {
		costs = []
		// Go through each node and get the cheapest upgrade
		for (let i = 0; i < nodes; i++) {
			costs.push(getCheapestCost(ns, i))
		}
		// Buy the cheapest upgrade from all nodes
		let cheapest = Math.min(...costs.map(c => c.cost))
		// Find the index of the cheapest cost in the list
		let index = costs.findIndex(c => c.cost === cheapest)
		// Wait to buy the cheapest upgrade
		try {
			await buy(ns, costs[index].type, costs[index].cost, index, timeout)
		} catch (e) {
			ns.tprint(e)
			ns.exit()
		}
		// Make sure that the number of nodes is up-to-date
		nodes = ns.hacknet.numNodes()
	}
}

/**
 * Wait until the player has enough money to buy something
 * @param ns Global NS object
 * @param money Amount of money to wait for
 * @param timeout=-1 Number of seconds to wait before timing out.
 * @throws Error if the timeout is reached
 * @note This function will wait forever by default
 */
async function waitUntilMoney(ns: NS, money: number, timeout: number = -1) {
	while (ns.getServerMoneyAvailable('home') < money) {
		await ns.sleep(1000)
		if (timeout == 0) {
			throw new Error('Timed out waiting for money')
		} else if (timeout > -1) {
			timeout--
		}
	}
}

async function buy(ns: NS, type: Type, cost: number, node: number, timeout: number) {
	await waitUntilMoney(ns, cost, timeout)
	switch (type) {
		case Type.newNode:
			ns.hacknet.purchaseNode()
			break
		case Type.level:
			ns.hacknet.upgradeLevel(node)
			break
		case Type.ram:
			ns.hacknet.upgradeRam(node)
			break
		case Type.core:
			ns.hacknet.upgradeCore(node)
			break
	}
}

function getCheapestCost(ns: NS, node: number) {
	let nodeCost = ns.hacknet.getPurchaseNodeCost()
	let levelCost = ns.hacknet.getLevelUpgradeCost(node)
	let ramCost = ns.hacknet.getRamUpgradeCost(node)
	let coreCost = ns.hacknet.getCoreUpgradeCost(node)
	let cheapest = Math.min(nodeCost, levelCost, ramCost, coreCost)
	switch (cheapest) {
		case nodeCost:
			return { type: Type.newNode, cost: nodeCost }
		case levelCost:
			return { type: Type.level, cost: levelCost }
		case ramCost:
			return { type: Type.ram, cost: ramCost }
		case coreCost:
			return { type: Type.core, cost: coreCost }
	}
}
