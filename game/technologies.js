module.exports = {
    "iron swords": {
        building: 'forge',
        duration: 5000,
        requirement: [ 
            { type: 'buildings', kind: 'research', requirement: 'forge', level: 2 },
            { type: 'buildings', kind: 'military', requirement: 'barracks', level: 3 }
        ],
        allows: [{type: 'unit', unit: 'swordsman' }, { type: 'research', unit: 'long swords' }],
        cost: {
            iron: 100,
            gold: 100
        }
    },
    "long swords": {
        building: 'forge',
        duration: 2000,
        requirement: [
             { type: 'buildings', kind:'research', requirement: 'forge', level: 3 },
             { type: 'buildings', kind: 'military', requirement: 'barracks', level: 4  },
             { type: 'research', requirement: 'iron swords' }
        ],
        allows: [ { type: 'unit', unit: 'long swordsman' }],//{ type: 'unit', unit: 'long swordsman' }
        cost: {
            iron: 200,
            gold: 200
        }
    },
    "crossbows": {
        building: 'fletcher',
        duration: 2000,
        requirement: [],
        allows: [{ type: 'unit', unit: 'crossbowman' }],
        requirement: [
            { type: 'buildings', kind:'research', requirement: 'forge', level: 7 },
            { type: 'buildings', kind: 'military', requirement: 'barracks', level: 6  },
            // { type: 'research', requirement: 'iron swords' }
       ],
        cost: {
            wood: 100,
            gold: 100,
            iron: 100
        }
    },
    "plate armour": {
        building: 'forge',//change to something else
        duration: 2000,
        requirement: [],
        allows: [{ type: 'unit', unit: 'teutonic knight' }],
        cost: {
            iron: 100,
            gold: 200
        }
    }


};