module.exports = {
    lumbermill: {
        1: {
            income: {
                wood: 10,
                gold: 1,
                iron: 1
            },
            cost: {
                wood: 100,
                gold: 50
            },
            duration: 5000,
            workers: 5
        },
        2: {
            income: {
                wood: 20,
                gold: 5,
                iron: 4
            },
            cost: {
                wood: 200,
                gold: 100
            },
            duration: 3000,
            workers: 8
        }
    },
    pasture: {
        1: {
            income: {
                food: 10,
                gold: 2
            },
            cost: {
                wood: 100,
                gold: 50
            },
            duration: 5000,
            workers: 5
        }
    },
    wheat_farm: {
        1: {
            income: {
                food: 15,
            },
            cost: {
                wood: 100,
                gold: 50
            },
            duration: 5000,
            workers: 5
        }
    },
    quarry: {
        1: {
            income: {
                stone: 10
            },
            cost: { 
                wood: 100,
                gold: 50
            },
            duration: 5000,
            workers: 13
        }
    },
    silver_mine: {
        1: {
            income: {
                silver: 5
            },
            cost: {
                wood: 100,
                gold: 50
            },
            duration: 5000,
            workers: 20
        },
        2: {
            income: {
                silver: 10
            },
            cost: {
                wood: 250,
                gold: 120
            },
            duration: 5000,
            workers: 34
        }
    }
};