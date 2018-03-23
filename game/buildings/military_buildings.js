module.exports = {
    barracks: {
        1: {
            speed: 5,
            duration: 3000,
            cost: {
                wood: 1000,
                gold: 1000,
                stone: 400
            },
            allows: [{ type: 'research', allow: 'forge', level: 1}]
        },
        2: {
            unit: 'pikeman',
            speed: 6,
            duration: 5000,
            cost: {
                wood: 1000,
                gold: 1000,
                stone: 400
            },
            // allows: [{ type: 'researchable', allow: 'iron swords' }]
        },
        3: {
            duration: 3000,
            cost: {
                wood: 4000,
                gold: 3000,
                stone: 1000
            },
            allows: [{ type: 'researchable', allow: 'iron swords' }]
        }, 
        4: {
            duration: 3000,
            cost: {
                wood: 400,
                gold: 400,
                stone: 200
            },
            allows: [{ type: 'researchable', allow: 'long swords' }]
        }
    }
};