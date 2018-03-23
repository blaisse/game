module.exports = {
    peasant: {
        hp: 20,
        attack: 5,
        defence: 5,
        duration: 3000,
        spot: 1,
        movement: 2,
        loot: 20,
        experience: 100,
        cost: {
            wood: 5,
            food: 15,
            gold: 5,
        },
        upkeep: {
            food: 1,
            gold: 1,
        }
    },
    pikeman: {
        hp: 50,
        duration: 2000,
        spot: 1,
        movement: 2,
        loot: 40,
        cost: {
            wood: 10,
            food: 25,
            gold: 10
        }, 
        upkeep: {
            food: 1,
            gold: 2
        }
    },
    swordsman: {
        hp: 80,
        attack: 20,
        defence: 30,
        duration: 3000,
        spot: 1,
        movement: 2,
        loot: 30,
        experience: 20,
        requirement: [ {type: 'research', requirement: 'iron swords'} ],//can be more than 1
        cost: {
            food: 40,
            gold: 15,
            iron: 20,
            silver: 10
        },
        upkeep: {
            food: 2,
            gold: 3
        }
    },
    "long swordsman": {
        hp: 110,
        duration: 2000,
        spot: 1,
        movement: 2,
        loot: 25,
        requirement: [{ type: 'research', requirement: 'long swords' }],
        cost: {
            food: 60,
            gold: 20,
            iron: 30,
            silver: 20
        },
        upkeep: {
            food: 2,
            gold: 4
        }

    },
    cossack: {
        hp: 130,
        duration: 5000,
        spot: 2,
        movement: 10,
        loot: 250,
        cost: {
            wood: 10,
            food: 50,
            gold: 35
        },
        upkeep: {
            food: 3,
            gold: 5
        }
    }
};