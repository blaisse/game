module.exports = {
    forge: {
        1: {
            duration: 1000,
            cost: {
                wood: 100,
                gold: 100,
                stone: 100,
                iron: 200
            },
            requirement: [{ type: 'buildings', building: 'barracks', level: 1 }]
        }, 
        2: {
            duration: 2000,
            cost: {
                wood: 200,
                gold: 200,
                stone: 200,
                iron: 200
            },
            allows: [{ type: 'researchable', allow: 'iron swords' }]
        },
        3: {
            duration: 20000,
            cost: {
                wood: 200,
                gold: 200,
                stone: 200,
                iron: 200
            },
            allows: [{ type: 'researchable', allow: 'long swords' }]
        }
    }
};